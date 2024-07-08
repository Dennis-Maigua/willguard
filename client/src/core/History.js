import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { MdOutlineContentCopy } from 'react-icons/md';
import axios from 'axios';

import Layout from '../core/Layout';
import { getCookie, isAuth } from '../auth/helpers';

const History = () => {
    const [values, setValues] = useState({
        account: '',
        balance: '',
        wills: [],
        status: 'Pending'
    });

    useEffect(() => {
        fetchWills();
    }, []);

    const navigate = useNavigate();
    const token = getCookie('token');
    const { account, balance, wills, status } = values;

    const fetchWills = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API}/wills/${account}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log('FETCH WILLS SUCCESS:', response);
            setValues({ ...values, wills: response.data });
        }

        catch (err) {
            console.error('FETCH WILLS FAILED:', err.response.data.error);
        }
    };

    const shortenAddress = (address) => {
        return `${address.slice(0, 5)}...${address.slice(-5)}`;
    };

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

            <section className='mx-auto px-4 py-6 flex flex-col gap-8 bg-gray-100 shadow rounded'>
                <div className='px-10 flex items-center justify-between md:flex-row flex-col text-lg text-center gap-8'>
                    <div className='flex md:flex-row flex-col md:items-center gap-2'>
                        <span className='text-red-600 font-semibold'> Account: </span>
                        {!account ? (
                            <button onClick={() => { navigate('/create-will') }}
                                className='py-2 px-4 font-semibold bg-white hover:opacity-80 border shadow rounded-md cursor-pointer'
                            >
                                Create a Will
                            </button>
                        ) : (
                            <span> {account} </span>
                        )}
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
                                <th className='px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'> Value (ETH) </th>
                                <th className='px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'> Status </th>
                                <th className='px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'> Actions </th>
                            </tr>
                        </thead>
                        <tbody className='bg-white divide-y divide-gray-200'>
                            {wills.length > 0 ? (
                                wills.map((will, index) => (
                                    <tr key={index}>
                                        <td className='px-6 py-4 whitespace-nowrap'>
                                            <div className='flex items-center'>
                                                <span>{shortenAddress(will.contractAddress)}</span>
                                                <CopyToClipboard text={will.contractAddress}>
                                                    <button className='ml-2'>
                                                        <MdOutlineContentCopy className='text-gray-500 hover:text-gray-800' />
                                                    </button>
                                                </CopyToClipboard>
                                            </div>
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap'>
                                            <div className='flex items-center'>
                                                <span>{shortenAddress(will.txnHash)}</span>
                                                <CopyToClipboard text={will.txnHash}>
                                                    <button className='ml-2'>
                                                        <MdOutlineContentCopy className='text-gray-500 hover:text-gray-800' />
                                                    </button>
                                                </CopyToClipboard>
                                            </div>
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap'>
                                            <div className='flex items-center'>
                                                <span>{shortenAddress(will.from)}</span>
                                                <CopyToClipboard text={will.from}>
                                                    <button className='ml-2'>
                                                        <MdOutlineContentCopy className='text-gray-500 hover:text-gray-800' />
                                                    </button>
                                                </CopyToClipboard>
                                            </div>
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap'>
                                            <div className='flex items-center'>
                                                <span>{shortenAddress(will.to)}</span>
                                                <CopyToClipboard text={will.to}>
                                                    <button className='ml-2'>
                                                        <MdOutlineContentCopy className='text-gray-500 hover:text-gray-800' />
                                                    </button>
                                                </CopyToClipboard>
                                            </div>
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap'> {will.value} </td>
                                        <td className='px-6 py-4 whitespace-nowrap'> {will.status} </td>

                                        {will.status === 'Pending' ? (
                                            <td className='px-6 py-4 whitespace-nowrap'>
                                                <button className='text-red-500 hover:opacity-80 font-medium'>
                                                    Payout
                                                </button>
                                            </td>
                                        ) : (
                                            <td className='px-6 py-4 whitespace-nowrap'>
                                                <button disabled className='text-gray-300 font-medium'>
                                                    Paid
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td className='px-6 py-4 whitespace-nowrap' colSpan='7'>
                                        <div className='text-center text-gray-500'>No wills found</div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </Layout>
    );
};

export default History;
