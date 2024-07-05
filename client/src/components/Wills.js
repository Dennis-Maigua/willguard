import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import Web3 from 'web3';
import Layout from '../core/Layout';
import { isAuth } from '../auth/helpers';
import Will from '../truffle_abis/Will.json';

const Wills = () => {
    const [account, setAccount] = useState('');
    const [balance, setBalance] = useState('');
    const [contract, setContract] = useState(null);
    const [beneficiary, setBeneficiary] = useState('');
    const [amount, setAmount] = useState('');

    const [owner, setOwner] = useState('');
    const [beneficiaries, setBeneficiaries] = useState([]);

    useEffect(() => {
        const init = async () => {
            await loadWeb3();
            await loadBlockchainData();
        };
        init();
    }, []);

    const loadWeb3 = async () => {
        if (window.ethereum) {
            const web3 = new Web3(window.ethereum);
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const accounts = await web3.eth.getAccounts();
                setAccount(accounts[0]);
            }
            catch (error) {
                toast.error('Failed to load web3 accounts. Make sure MetaMask is installed and connected.');
                console.error('Error loading web3:', error);
            }
        }
        else {
            toast.error('Non-Ethereum browser detected. You should consider trying MetaMask!');
        }
    };

    const loadBlockchainData = async () => {
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = Will.networks[networkId];

        if (deployedNetwork) {
            const contractInstance = new web3.eth.Contract(Will.abi, deployedNetwork.address);
            setContract(contractInstance);

            const accountBalance = await web3.eth.getBalance(accounts[0]);
            setBalance(web3.utils.fromWei(accountBalance, 'ether'));
        }
        else {
            toast.error('Will contract not deployed on the current network.');
        }
    };

    const handleCreateWill = async () => {
        if (!contract) {
            toast.error('Will contract not loaded.');
            return;
        }

        if (!beneficiary || !amount) {
            toast.error('Beneficiary address and amount are required.');
            return;
        }

        const web3 = new Web3(window.ethereum);
        const amountInWei = web3.utils.toWei(amount, 'ether');

        try {
            await contract.methods.setInheritance(beneficiary, amountInWei).send({ from: account });
            toast.success('Will created successfully!');
            fetchContractDetails();
        }
        catch (error) {
            toast.error('Failed to create will. Ensure all details are correct and try again.');
            console.error('Error creating will:', error);
        }
    };

    const fetchContractDetails = async () => {
        try {
            if (contract) {
                const web3 = new Web3(window.ethereum);

                const sender = await contract.methods.owner().call();
                const familyWallets = await contract.methods.familyWallets().call();

                const receivers = await Promise.all(familyWallets.map(async (wallet) => ({
                    address: wallet,
                    amount: web3.utils.fromWei(await contract.methods.inheritance(wallet).call(), 'ether')
                })));

                setOwner(sender);
                setBeneficiaries(receivers);
            }
        } catch (error) {
            console.error("Error fetching contract details:", error);
        }
    };


    const handlePayout = async () => {
        try {
            const web3 = new Web3(window.ethereum);
            const accounts = await web3.eth.getAccounts();
            await contract.methods.hasDeceased().send({ from: accounts[0] });

            toast.success('Payout executed successfully');
            fetchContractDetails();
        }
        catch (error) {
            console.error("Error executing payout: ", error);
        }
    };

    return (
        <Layout>
            <ToastContainer />
            {!isAuth() && <Navigate to='/signin' />}
            <HeroSection />
            <section className='mx-auto px-4 py-8 flex flex-col gap-8 font-semibold bg-gray-100 shadow rounded'>
                <div className='px-10 flex items-center justify-between md:flex-row flex-col text-lg text-center gap-8'>
                    <div className='flex md:flex-row flex-col gap-2'>
                        <span className='text-red-600'>My Wallet Address:</span>
                        <span>{account}</span>
                    </div>
                    <div className='flex md:flex-row flex-col gap-2'>
                        <span className='text-red-600'>Account Balance:</span>
                        <span>{balance} ETH</span>
                    </div>
                </div>
            </section>

            <div className="max-w-lg m-auto text-center flex flex-col gap-4 px-4 py-10">
                <form className='p-10 flex flex-col shadow-md rounded gap-4 bg-gray-100'>
                    <input
                        type="text"
                        placeholder="Beneficiary Address"
                        value={beneficiary}
                        onChange={e => setBeneficiary(e.target.value)}
                        className='p-3 shadow rounded'
                    />
                    <input
                        type="text"
                        placeholder="Amount in ETH"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        className='p-3 shadow rounded'
                    />
                    <button
                        type="button"
                        onClick={handleCreateWill}
                        className="py-3 text-white font-semibold bg-red-500 hover:opacity-90 shadow rounded"
                    >
                        Create Will
                    </button>
                    <button
                        onClick={fetchContractDetails}
                        className="bg-blue-500 text-white py-3 rounded hover:bg-blue-600 shadow font-semibold"
                    >
                        Update Contracts
                    </button>
                </form>
            </div>

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
                            {beneficiaries.length > 0 ? beneficiaries.map((beneficiary, index) => (
                                <tr key={index}>
                                    <td className='px-6 py-4 whitespace-nowrap'> 0x325...Ef9Ba </td>
                                    <td className='px-6 py-4 whitespace-nowrap'> 0x2d7...6899d </td>
                                    <td className='px-6 py-4 whitespace-nowrap'> 0x469...89D1E </td>
                                    <td className='px-6 py-4 whitespace-nowrap'> 0x903...82b78  </td>
                                    <td className='px-6 py-4 whitespace-nowrap'> 10.00 ETH </td>
                                    <td className='px-6 py-4 whitespace-nowrap font-medium'>
                                        <button onClick={handlePayout} className='text-red-500 hover:text-red-700'> Payout </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td className='px-6 py-4 whitespace-nowrap text-center' colSpan='6'>
                                        No wills found.
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

const HeroSection = () => (
    <section className="bg-gray-600 text-white py-14">
        <div className="container mx-auto px-6 text-center">
            <h1 className="text-5xl font-bold mb-2"> Wills </h1>
        </div>
    </section>
);

export default Wills;
