import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import Layout from '../core/Layout';
import { authenticate, isAuth } from './helpers';

const Signin = () => {
    const [values, setValues] = useState({
        email: '',
        password: '',
        buttonText: 'Submit'
    });

    const navigate = useNavigate();
    const { email, password, buttonText } = values;

    const handleChange = (event) => {
        const { name, value } = event.target;
        setValues({ ...values, [name]: value });
    };

    const clickSubmit = async (event) => {
        event.preventDefault();
        setValues({ ...values, buttonText: 'Submitting...' });

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API}/signin`, { email, password }
            );

            console.log('USER SIGNIN SUCCESS:', response);

            authenticate(response, () => {
                setValues({ ...values, email: '', password: '', buttonText: 'Submitted' });
                // toast.success(response.data.message);
                isAuth() && isAuth().role === 'admin' ? navigate('/admin') : navigate('/user');
            });
        }

        catch (err) {
            console.log('USER SIGNIN FAILED:', err.response.data.error);
            setValues({ ...values, buttonText: 'Submit' });
            toast.error(err.response.data.error);
        }
    };

    return (
        <Layout>
            <ToastContainer />
            {isAuth() ? <Navigate to='/' /> : null}
            <div className='max-w-lg m-auto text-center flex flex-col gap-4'>
                <h1 className='text-3xl font-semibold'> Sign In </h1>

                <form onSubmit={clickSubmit} className='p-10 flex flex-col shadow-md rounded gap-4'>
                    <input
                        type='email'
                        name='email'
                        value={email}
                        placeholder='Email'
                        onChange={handleChange}
                        className='p-3 shadow rounded'
                    />
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

                <div className='px-5 flex items-center justify-between font-medium text-gray-500'>
                    <Link to='/signup' className='hover:text-red-500'> Sign Up </Link>
                    <Link to='/forgot-password' className='hover:text-red-500'> Forgot Password? </Link>
                </div>
            </div>
        </Layout>
    );
};

export default Signin;