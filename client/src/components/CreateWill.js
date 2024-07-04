import React, { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import Web3 from 'web3';

import Layout from '../core/Layout';
import Will from '../contracts/Will.json';
import { isAuth } from '../auth/helpers';
import { Navigate } from 'react-router-dom';

const CreateWill = () => {
    const [web3, setWeb3] = useState(null);
    const [account, setAccount] = useState('');
    const [lawyer, setLawyer] = useState('');
    const [beneficiary, setBeneficiary] = useState('');
    const [amount, setAmount] = useState('');
    const [interval, setInterval] = useState('');

    useEffect(() => {
        if (window.ethereum) {
            const web3Instance = new Web3(window.ethereum);
            setWeb3(web3Instance);
            window.ethereum.enable().then(accounts => {
                setAccount(accounts[0]);
            });
        } else {
            alert('Please install MetaMask!');
        }
    }, []);

    const createWill = async () => {
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = Will.networks[networkId];
        const willContract = new web3.eth.Contract(Will.abi, deployedNetwork && deployedNetwork.address);

        await willContract.methods
            .setWill(beneficiary, web3.utils.toWei(amount, 'ether'), interval)
            .send({ from: account, value: web3.utils.toWei(amount, 'ether') });
    };

    return (
        <Layout>
            <ToastContainer />
            {!isAuth() ? <Navigate to='/signin' /> : null}
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
                        onClick={() => web3.eth.requestAccounts()}
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
