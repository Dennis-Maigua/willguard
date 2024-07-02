import React from 'react';
import Layout from '../core/Layout';
import { ToastContainer } from 'react-toastify';

const Wills = () => {
    return (
        <Layout>
            <ToastContainer />
            <div className='flex flex-col justify-center items-center h-screen'>
                <h1 className='text-3xl font-semibold'> Wills </h1>
            </div>
        </Layout>
    );
};

export default Wills;
