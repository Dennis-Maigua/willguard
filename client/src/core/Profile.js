import React, { useEffect, useRef, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { app } from '../firebase';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import Layout from './Layout';
import { getCookie, isAuth, signout, updateLocalStorage } from '../auth/helpers';
import Avatar from '../assets/avatar.png';

const Profile = () => {
    const [values, setValues] = useState({
        role: '',
        name: '',
        email: '',
        password: '',
        profile: '',
        phone: '',
        address: '',
        buttonText: 'Update'
    });

    const fileRef = useRef(null);
    const [image, setImage] = useState(null);
    const [imageError, setImageError] = useState(false);
    const [imagePercent, setImagePercent] = useState(0);

    useEffect(() => {
        loadProfile();

        if (image) {
            handleFileUpload(image);
        }
    }, [image]);

    const token = getCookie('token');
    const navigate = useNavigate();
    const { role, profile, name, email, password, phone, address, buttonText } = values;

    const handleFileUpload = async (image) => {
        if (image.size > 2 * 1024 * 1024) {
            setImageError(true);
            return;
        }

        const storage = getStorage(app);
        const fileName = new Date().getTime() + image.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setImagePercent(Math.round(progress));
            },
            (error) => {
                console.error('Error uploading image:', error);
                setImageError(true);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    // console.log('File available at', downloadURL);
                    setValues({ ...values, profile: downloadURL });
                    setImagePercent(100);
                });
            }
        );
    };

    const loadProfile = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API}/profile/${isAuth()._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log('LOAD PROFILE SUCCESS:', response);
            const { role, profile, name, email, phone, address } = response.data;
            setValues({ ...values, role, profile, name, email, phone, address });
        }

        catch (err) {
            console.log('LOAD PROFILE FAILED:', err.response.data.error);

            if (err.response.status === 401) {
                signout(() => {
                    navigate('/')
                });
            }
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setValues({ ...values, [name]: value });
    };

    const clickUpdate = async (event) => {
        event.preventDefault();
        setValues({ ...values, buttonText: 'Updating' });

        if (image) {
            handleFileUpload(image);
        }

        try {
            const response = await axios.put(
                `${process.env.REACT_APP_API}/profile/update`, { role, profile, name, email, password, phone, address }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log('UPDATE ADMIN PROFILE SUCCESS:', response);
            updateLocalStorage(response, () => {
                setValues({ ...values, buttonText: 'Updated' });
                toast.success('Profile updated successfully!');
            });
        }

        catch (err) {
            console.log('UPDATE ADMIN PROFILE FAILED:', err.response.data.error);
            setValues({ ...values, buttonText: 'Update' });
        }
    };

    const handleDeleteAccount = async () => {
        const confirmDelete = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');

        if (confirmDelete) {
            try {
                const response = await axios.delete(
                    `${process.env.REACT_APP_API}/profile/delete`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                console.log('DELETE ADMIN ACCOUNT SUCCESS:', response);
                toast.success('Account deleted successfully!');

                signout(() => {
                    navigate('/signin');
                });
            }

            catch (err) {
                console.log('DELETE ADMIN ACCOUNT FAILED:', err.response.data.error);
                toast.error(err.response.data.error);
            }
        }
    };

    return (
        <Layout>
            <ToastContainer />
            {!isAuth() ? <Navigate to='/signin' /> : null}
            <div className="bg-gray-600 text-white py-14">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-5xl font-bold mb-2">
                        Profile
                    </h1>
                </div>
            </div>

            <div className='max-w-xl m-auto text-center flex flex-col gap-4 px-4 py-10'>
                <form onSubmit={clickUpdate} className='p-10 flex flex-col shadow rounded gap-4 bg-gray-100'>
                    <input
                        type='file'
                        ref={fileRef}
                        accept='image/*'
                        onChange={(e) => setImage(e.target.files[0])}
                        hidden
                    />
                    <img
                        src={profile || values.profile || Avatar}
                        alt='avatar'
                        name='profile'
                        className='h-24 w-24 rounded-full self-center border object-cover cursor-pointer'
                        onClick={() => fileRef.current.click()}
                    />
                    <div className='text-sm text-center'>
                        {imageError ? (
                            <span className='text-red-500'>
                                Error! File size must be less than 2 MB.
                            </span>
                        )
                            : imagePercent > 0 && imagePercent < 100 ? (
                                <span className='text-slate-500'>
                                    Uploading: {imagePercent} %
                                </span>
                            )
                                : imagePercent === 100 ? (
                                    <span className='text-green-500'>
                                        Image uploaded successfully!
                                    </span>
                                )
                                    : null
                        }
                    </div>

                    {isAuth() && isAuth().role === 'subscriber' && (
                        <div className='flex flex-row gap-4'>
                            <input
                                type='text'
                                name='role'
                                value={role}
                                placeholder='Role'
                                className='p-3 shadow rounded'
                                disabled
                            />
                            <input
                                type='email'
                                name='email'
                                value={email}
                                placeholder='Email'
                                className='p-3 shadow rounded w-full'
                                disabled
                            />
                        </div>
                    )}

                    {isAuth() && isAuth().role === 'admin' && (
                        <div className='flex flex-row gap-4'>
                            <input
                                type='text'
                                name='role'
                                value={role}
                                placeholder='Role'
                                className='p-3 shadow rounded'
                            />
                            <input
                                type='email'
                                name='email'
                                value={email}
                                placeholder='Email'
                                className='p-3 shadow rounded w-full'
                            />
                        </div>
                    )}

                    <div className='flex flex-row gap-4'>
                        <input
                            type='text'
                            name='name'
                            value={name}
                            placeholder='Name'
                            onChange={handleChange}
                            className='p-3 shadow rounded'
                        />
                        <input
                            type='password'
                            name='password'
                            value={password}
                            placeholder='Password'
                            onChange={handleChange}
                            className='p-3 shadow rounded w-full'
                        />
                    </div>

                    <div className='flex flex-row gap-4'>
                        <input
                            type='phone'
                            name='phone'
                            value={phone}
                            placeholder='Phone'
                            onChange={handleChange}
                            className='p-3 shadow rounded'
                        />
                        <input
                            type='text'
                            name='address'
                            value={address}
                            placeholder='Address'
                            onChange={handleChange}
                            className='p-3 shadow rounded w-full'
                        />
                    </div>
                    <input
                        type='submit'
                        value={buttonText}
                        className='py-3 text-white font-semibold bg-red-500 hover:opacity-90 shadow rounded cursor-pointer'
                    />
                </form>

                <span onClick={handleDeleteAccount} className='font-medium text-gray-500 hover:text-red-500 cursor-pointer'> Delete Account </span>
            </div>
        </Layout>
    );
};

export default Profile;