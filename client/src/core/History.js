import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Web3 from 'web3';
import { ToastContainer } from 'react-toastify';

import Layout from './Layout';
// import Will from '../contracts/Will.json';
import { isAuth } from '../auth/helpers';

const History = () => {
    const [web3, setWeb3] = useState(null);
    const [account, setAccount] = useState('');
    const [contractAddress, setContractAddress] = useState('');

    // useEffect(() => {
    //     if (window.ethereum) {
    //         const web3Instance = new Web3(window.ethereum);
    //         setWeb3(web3Instance);
    //         window.ethereum.enable().then(accounts => {
    //             setAccount(accounts[0]);
    //         });
    //     } else {
    //         alert('Please install MetaMask!');
    //     }
    // }, []);

    // const executeWill = async () => {
    //     const willContract = new web3.eth.Contract(Will.abi, contractAddress);

    //     await willContract.methods.execute().send({ from: account });
    // };

    return (
        <Layout>
            <ToastContainer />
            {!isAuth() ? <Navigate to='/signin' /> : null}
            <HeroSection />
            <div className="m-auto text-center flex flex-col gap-4">
                <form onSubmit='{executeWill}' className='p-10 flex flex-col md:flex-row shadow-md rounded gap-4 bg-gray-100'>
                    <input
                        type="text"
                        placeholder="Contract Address"
                        value={contractAddress}
                        onChange={(e) => setContractAddress(e.target.value)}
                        className="block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                    />
                    <input
                        type='submit'
                        value="Execute Will"
                        // value={buttonText}
                        className='w-full py-3 text-white font-semibold bg-red-500 hover:opacity-90 shadow rounded cursor-pointer'
                    />
                    <button
                        onClick={() => web3.eth.requestAccounts()}
                        className="w-full pc-4 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                        Connect Wallet
                    </button>
                </form>
            </div>

            <div className="px-6 rounded-lg shadow-md mb-4 py-10">
                <h1 className='font-bold text-xl text-center my-10'> My Wills </h1>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> Block Number </th>
                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> Contract Address </th>
                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> Txn Hash </th>
                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> From </th>
                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> To </th>
                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> Value ETH </th>
                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> Gas </th>
                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> Actions </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap"> 22 </td>
                            <td className="px-6 py-4 whitespace-nowrap"> 0x325...Ef9Ba </td>
                            <td className="px-6 py-4 whitespace-nowrap"> 0x2d7...6899d </td>
                            <td className="px-6 py-4 whitespace-nowrap"> 0x469...89D1E </td>
                            <td className="px-6 py-4 whitespace-nowrap"> 0x903...82b78  </td>
                            <td className="px-6 py-4 whitespace-nowrap"> 10.00 ETH </td>
                            <td className="px-6 py-4 whitespace-nowrap"> 88310 </td>
                            <td className="px-6 py-4 whitespace-nowrap font-medium">
                                <button className="text-indigo-400 hover:text-indigo-700"> View </button>
                                <button className="text-red-500 hover:text-red-700 ml-4"> Send </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </Layout>
    );
};

const HeroSection = () => {
    return (
        <section className="bg-gray-600 text-white py-14">
            <div className="container mx-auto px-6 text-center">
                <h1 className="text-5xl font-bold mb-2">
                    History
                </h1>
            </div>
        </section>
    );
};

export default History;
