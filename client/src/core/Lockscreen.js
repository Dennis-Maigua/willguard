import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { getCookie } from '../auth/helpers';

const LockScreen = () => {
    const [values, setValues] = useState({
        password: '',
        buttonText: 'Unlock'
    });

    const navigate = useNavigate();
    const token = getCookie('token');
    const { password, buttonText } = values;

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

            console.log('SCREEN UNLOCK SUCCESS:', response);
            // toast.success(response.data.message);    
            setValues({ ...values, password: '', buttonText: 'Unlocked' });

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
            <div className='max-w-lg m-auto px-4 text-center flex flex-col justify-center items-center h-screen gap-4'>
                <h1 className='text-2xl'>
                    Locked Screen
                </h1>
                <span> Please enter your password to return to the website: </span>

                <form onSubmit={handleUnlock} className='w-full p-10 flex flex-col shadow-md rounded gap-4'>
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
