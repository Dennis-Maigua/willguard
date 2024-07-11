import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { MdOutlineContentCopy } from 'react-icons/md';

import Layout from '../core/Layout';
import { isAuth } from '../utils/helpers';

const History = () => {
    const [wills, setWills] = useState([]);

    useEffect(() => {
        fetchWills();
    }, []);

    const fetchWills = async () => {
        const storedWills = JSON.parse(localStorage.getItem('will')) || [];
        setWills(storedWills);

        // try {
        //     const response = await axios.get(
        //         `${process.env.REACT_APP_API}/wills/${account}`, {
        //         headers: {
        //             Authorization: `Bearer ${token}`
        //         }
        //     });

        //     console.log('FETCH WILLS SUCCESS:', response);
        //     setValues({ ...values, wills: response.data });
        // }

        // catch (err) {
        //     console.error('FETCH WILLS FAILED:', err);
        // }
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

            <section className='max-w-7xl mx-auto px-4 py-14'>
                <div className='shadow rounded overflow-x-auto'>
                    <table className='min-w-full divide-y divide-gray-200'>
                        <thead>
                            <tr>
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
