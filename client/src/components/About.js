import React from 'react';
import Layout from '../core/Layout';
import { ToastContainer } from 'react-toastify';

const About = () => {
    return (
        <Layout>
            <ToastContainer />
            <div className='flex flex-col justify-center items-center h-screen'>
                <h1 className='text-3xl font-semibold'> About </h1>
            </div>
        </Layout>
    );
};

export default About;