import React from 'react';
import Layout from './core/Layout';
import { ToastContainer } from 'react-toastify';

const App = () => {
  return (
    <Layout>
      <ToastContainer />
      <div className='flex flex-col justify-center items-center h-screen'>
        <h1 className='text-3xl font-semibold'> Home Page </h1>
      </div>
    </Layout>
  );
};

export default App;
