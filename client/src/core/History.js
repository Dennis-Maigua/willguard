import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Web3 from 'web3';
import { toast, ToastContainer } from 'react-toastify';

import Layout from './Layout';
import { isAuth } from '../auth/helpers';
import Will from '../truffle_abis/Will.json';

const History = () => {
    const [values, setValues] = useState({
        account: '',
        will: {},
        balance: '',
        transactions: []
    });

    useEffect(() => {
        const init = async () => {
            await loadWeb3();
            await loadBlockchainData();
        };
        init();
    }, []);

    const { account, will, balance, transactions } = values;

    const loadWeb3 = async () => {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);

            await window.ethereum.request({
                method: 'eth_requestAccounts'
            })
                .then((accounts) => {
                    console.log('ADDRESS:', accounts[0]);
                })
                .catch((err) => {
                    console.error('LOAD WEB3 FAILED:', err);
                });
        }
        else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        }
        else {
            toast.error('Error connecting to web3! Try Installing MetaMask.');
        }
    };

    const loadBlockchainData = async () => {
        const web3 = window.web3;
        const accounts = await web3.eth.getAccounts();
        const accountBalance = await web3.eth.getBalance(accounts[0]);
        const networkId = await web3.eth.net.getId();
        // console.log('ADDRESS:', accounts[0]);
        // console.log('BALANCE:', accountBalance);
        // console.log('NETWORK ID:', networkId);

        if (accounts.length > 0) {
            const willData = Will.networks[networkId];
            if (willData) {
                const will = new web3.eth.Contract(
                    Will.abi,
                    willData && willData.address
                );
                setValues({
                    ...values,
                    account: accounts[0],
                    will: will,
                    balance: web3.utils.fromWei(accountBalance, 'ether')
                });
            }
            else {
                toast.error('No detected network! Will contract has not been deployed.');
            }
        }
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

            <section className='mx-auto px-4 py-8 flex flex-col gap-8 font-semibold bg-gray-100 shadow rounded'>
                <div className='px-10 flex items-center justify-between md:flex-row flex-col text-lg text-center gap-8'>
                    <div className='flex md:flex-row flex-col gap-2'>
                        <span className='text-red-600'> My Wallet Address: </span>
                        <span> {account} </span>
                    </div>
                    <div className='flex md:flex-row flex-col gap-2'>
                        <span className='text-red-600'> Account Balance: </span>
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
