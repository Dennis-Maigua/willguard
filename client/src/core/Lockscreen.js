import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { getCookie, isAuth } from '../auth/helpers';

const LockScreen = () => {
    const [values, setValues] = useState({
        password: '',
        buttonText: 'Unlock'
    });

    const navigate = useNavigate();
    const token = getCookie('token');
    const { password, buttonText } = values;

    useEffect(() => {
        window.addEventListener('beforeunload', handleBeforeUnload);

        // Cleanup event listener on component unmount
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    const handleBeforeUnload = (event) => {
        // Prevent navigation
        event.preventDefault();
        event.returnValue = '';
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setValues({ ...values, [name]: value });
    };

    const handleUnlock = async (event) => {
        event.preventDefault();
        setValues({ ...values, buttonText: 'Unlocking...' });

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API}/lockscreen`, { password }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // toast.success(response.data.message);
            console.log('SCREEN UNLOCK SUCCESS:', response);

            setValues({ ...values, password: '', buttonText: 'Unlocked' });

            // Remove the beforeunload event listener since the screen is unlocked
            window.removeEventListener('beforeunload', handleBeforeUnload);
            navigate(-1);
        }

        catch (err) {
            console.log('SCREEN UNLOCK FAILED:', err.response.data.error);
            setValues({ ...values, buttonText: 'Unlock' });
            toast.error(err.response.data.error);
        }
    };

    return (
        <div>
            <ToastContainer />
            {!isAuth() ? <Navigate to='/signin' /> : null}
            <div className='max-w-lg m-auto px-4 text-center flex flex-col justify-center items-center h-screen gap-4'>
                <h1 className='text-2xl'>
                    Locked Screen
                </h1>
                <span> Please enter your password to return to the website: </span>

                <form onSubmit={handleUnlock} className='w-full p-10 flex flex-col shadow rounded gap-4 bg-gray-100'>
                    <input
                        type='password'
                        name='password'
                        value={password}
                        placeholder='Password'
                        onChange={handleChange}
                        className='p-3 shadow rounded'
                    />
                    <input
                        type='submit'
                        value={buttonText}
                        className='py-3 text-white font-semibold bg-red-500 hover:opacity-90 shadow rounded cursor-pointer'
                    />
                </form>
            </div>
        </div>
    );
};

export default LockScreen;
