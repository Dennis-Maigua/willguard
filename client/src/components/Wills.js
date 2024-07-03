import React, { useState } from 'react';
import Web3 from 'web3';
import Layout from '../core/Layout';
import { ToastContainer } from 'react-toastify';

const Wills = () => {
    const [web3, setWeb3] = useState(null);
    const [account, setAccount] = useState('');
    const [contractAddress, setContractAddress] = useState('');

    const loadWeb3 = async () => {
        if (window.ethereum) {
            const web3 = new Web3(window.ethereum);
            await window.ethereum.enable();
            setWeb3(web3);
            const accounts = await web3.eth.getAccounts();
            setAccount(accounts[0]);
        } else {
            alert('Please install MetaMask!');
        }
    };

    const executeWill = async () => {
        const willContract = new web3.eth.Contract(
            // ABI here
            [],
            contractAddress
        );

        await willContract.methods.execute().send({ from: account });
    };

    return (
        <Layout>
            <ToastContainer />
            <HeroSection />
            <div className="m-auto text-center flex flex-col gap-4">
                <form onSubmit={executeWill} className='p-10 flex flex-col md:flex-row shadow-md rounded gap-4 bg-gray-100'>
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
                        onClick={loadWeb3}
                        className="w-full pc-4 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                        Connect Wallet
                    </button>
                </form>
            </div>

            <div className="px-6 rounded-lg shadow-md mb-4 py-10">
                <h1 className='font-semibold text-center my-10'> Wills History </h1>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> ID </th>
                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> Transaction Hash </th>
                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> Contract Address </th>
                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> From Address </th>
                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> To Address </th>
                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> Actions </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap">   </td>
                            <td className="px-6 py-4 whitespace-nowrap">  </td>
                            <td className="px-6 py-4 whitespace-nowrap">   </td>
                            <td className="px-6 py-4 whitespace-nowrap">   </td>
                            <td className="px-6 py-4 whitespace-nowrap">   </td>
                            <td className="px-6 py-4 whitespace-nowrap font-medium">
                                <button className="text-blue-600 hover:text-indigo-900"> Edit </button>
                                <button className="text-red-600 hover:text-red-900 ml-4"> Delete </button>
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
                    Wills
                </h1>
            </div>
        </section>
    );
};

export default Wills;
