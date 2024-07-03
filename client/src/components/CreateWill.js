import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import Web3 from 'web3';
import Layout from '../core/Layout';

const CreateWill = () => {
    const [web3, setWeb3] = useState(null);
    const [account, setAccount] = useState('');
    const [lawyer, setLawyer] = useState('');
    const [beneficiary, setBeneficiary] = useState('');
    const [amount, setAmount] = useState('');
    const [interval, setInterval] = useState('');

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

    const createWill = async () => {
        const willContract = new web3.eth.Contract(
            // ABI here
            [],
            'deployed_contract_address'
        );

        await willContract.methods
            .constructor(lawyer, beneficiary, Web3.utils.toWei(amount, 'ether'), interval)
            .send({ from: account, value: Web3.utils.toWei(amount, 'ether') });
    };

    return (
        <Layout>
            <ToastContainer />
            <HeroSection />
            <div className="max-w-lg m-auto text-center flex flex-col gap-4 px-4 py-10">
                <form onSubmit={createWill} className='p-10 flex flex-col shadow-md rounded gap-4 bg-gray-100'>
                    <input
                        type="text"
                        placeholder="Lawyer Address"
                        value={lawyer}
                        onChange={(e) => setLawyer(e.target.value)}
                        className='p-3 shadow rounded'
                    />
                    <input
                        type="text"
                        placeholder="Beneficiary Address"
                        value={beneficiary}
                        onChange={(e) => setBeneficiary(e.target.value)}
                        className='p-3 shadow rounded'
                    />
                    <input
                        type="text"
                        placeholder="Amount in ETH"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className='p-3 shadow rounded'
                    />
                    <input
                        type="text"
                        placeholder="Interval (seconds)"
                        value={interval}
                        onChange={(e) => setInterval(e.target.value)}
                        className='p-3 shadow rounded'
                    />
                    <input
                        type='submit'
                        value="Create Will"
                        // value={buttonText}
                        className='py-3 text-white font-semibold bg-red-500 hover:opacity-90 shadow rounded cursor-pointer'
                    />
                    <button
                        onClick={loadWeb3}
                        className="w-full p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                        Connect Wallet
                    </button>
                </form>
            </div>
        </Layout>
    );
};

const HeroSection = () => {
    return (
        <section className="bg-gray-600 text-white py-14">
            <div className="container mx-auto px-6 text-center">
                <h1 className="text-5xl font-bold mb-2">
                    Create Will
                </h1>
            </div>
        </section>
    );
};

export default CreateWill;
