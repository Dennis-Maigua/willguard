import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { MdOutlineContentCopy } from 'react-icons/md';
import axios from 'axios';

import Layout from '../core/Layout';
import { getCookie, isAuth } from '../utils/helpers';

const History = ({ account }) => {
    const [wills, setWills] = useState([]);

    useEffect(() => {
        if (account) {
            fetchWills();
        }
    }, [account]);

    const token = getCookie('token');

    const fetchWills = async () => {
        // Get 'will' cookie from the localStorage
        // const storedWills = JSON.parse(localStorage.getItem('will')) || [];
        // setWills(storedWills);

        try {
            console.log('Fetching wills for account:', account);
            const response = await axios.get(
                `${process.env.REACT_APP_API}/wills/load`,
                {
                    params: { account },
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Cache-Control': 'no-cache',
                        'Pragma': 'no-cache',
                        'Expires': '0'
                    }
                }
            );

            console.log('FETCH USER WILLS SUCCESS:', response.data);
            setWills(response.data);
        }
        catch (err) {
            console.error('FETCH USER WILLS FAILED:', err);
        }
    };

    const shortenAddress = (address) => {
        return `${address.slice(0, 4)}...${address.slice(-4)}`;
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

            <section className='mx-auto px-4 py-6 flex flex-col gap-8 bg-slate-100 shadow rounded'>
                <div className='px-0 lg:px-10 flex items-center justify-between md:flex-row flex-col text-lg text-center gap-8'>
                    <Link to='/wills'
                        className='p-2 text-base font-semibold bg-white hover:opacity-80 border shadow rounded-md cursor-pointer'
                    >
                        + Create Will
                    </Link>

                    {account && (
                        <span>
                            <strong className='text-red-400'> Account: </strong> {account}
                            <CopyToClipboard text={account}>
                                <button className='ml-2'>
                                    <MdOutlineContentCopy className='text-gray-500 hover:text-gray-800' />
                                </button>
                            </CopyToClipboard>
                        </span>
                    )}
                </div>
            </section>

            <section className='max-w-7xl mx-auto px-4 py-10'>
                <div className='shadow rounded overflow-x-auto'>
                    <table className='min-w-full divide-y divide-gray-200'>
                        <thead>
                            <tr>
                                <th className='px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'> ID </th>
                                <th className='px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'> Contract Address </th>
                                <th className='px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'> Txn Hash </th>
                                <th className='px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'> From </th>
                                <th className='px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'> To </th>
                                <th className='px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'> Value (ETH) </th>
                                <th className='px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'> Status </th>
                            </tr>
                        </thead>
                        <tbody className='bg-white divide-y divide-gray-200'>
                            {wills.length > 0 ? (
                                wills.map((will, index) => (
                                    <tr key={index}>
                                        <td className='px-6 py-4 whitespace-nowrap'>
                                            <div className='flex items-center'>
                                                <span>{shortenAddress(will._id)}</span>
                                                <CopyToClipboard text={will._id}>
                                                    <button className='ml-2'>
                                                        <MdOutlineContentCopy className='text-gray-500 hover:text-gray-800' />
                                                    </button>
                                                </CopyToClipboard>
                                            </div>
                                        </td>

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
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td className='px-6 py-4 whitespace-nowrap' colSpan='7'>
                                        <div className='text-center text-gray-500'> No wills found </div>
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
