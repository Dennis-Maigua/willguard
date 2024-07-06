import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Layout from './Layout';
import { isAuth } from '../auth/helpers';

const History = () => {
    const [values, setValues] = useState({
        account: '',
        balance: '',
    });

    const { account, balance } = values;

    return (
        <Layout>
            <ToastContainer />
            {!isAuth() ? <Navigate to='/signin' /> : null}

            <section className='bg-gray-600 text-white py-14'>
                <div className='container mx-auto px-6 text-center'>
                    <h1 className='text-5xl font-bold mb-2'>
                        History
                    </h1>
                </div>
            </section>

            <section className='mx-auto px-4 py-8 flex flex-col gap-8 bg-gray-100 shadow rounded'>
                <div className='px-10 flex items-center justify-between md:flex-row flex-col text-lg text-center gap-8'>
                    <div className='flex md:flex-row flex-col gap-2'>
                        <span className='text-red-600 font-semibold'> Account: </span>
                        <span> {account} </span>
                    </div>
                    <div className='flex md:flex-row flex-col gap-2'>
                        <span className='text-red-600 font-semibold'> Balance: </span>
                        <span> {balance} ETH </span>
                    </div>
                </div>
            </section>

            <section className='max-w-7xl mx-auto px-4 py-14'>
                <div className='shadow rounded'>
                    <table className='min-w-full divide-y divide-gray-200'>
                        <thead>
                            <tr>
                                <th className='px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'> Contract Address </th>
                                <th className='px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'> Txn Hash </th>
                                <th className='px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'> From </th>
                                <th className='px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'> To </th>
                                <th className='px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'> Value ETH </th>
                                <th className='px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'> Actions </th>
                            </tr>
                        </thead>
                        <tbody className='bg-white divide-y divide-gray-200'>
                            <tr>
                                <td className='px-6 py-4 whitespace-nowrap'> 0x325...Ef9Ba </td>
                                <td className='px-6 py-4 whitespace-nowrap'> 0x2d7...6899d </td>
                                <td className='px-6 py-4 whitespace-nowrap'> 0x469...89D1E </td>
                                <td className='px-6 py-4 whitespace-nowrap'> 0x903...82b78  </td>
                                <td className='px-6 py-4 whitespace-nowrap'> 10.00 ETH </td>
                                <td className='px-6 py-4 whitespace-nowrap font-medium'>
                                    <button className='text-red-500 hover:text-red-700'> Payout </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </Layout>
    );
};

export default History;
