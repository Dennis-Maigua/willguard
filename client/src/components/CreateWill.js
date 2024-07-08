import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { MdOutlineContentCopy } from 'react-icons/md';
import Web3 from 'web3';
import axios from 'axios';

import Layout from '../core/Layout';
import { getCookie, isAuth } from '../auth/helpers';
import Will from '../truffle_abis/Will.json';

const CreateWill = () => {
    const [wills, setWills] = useState([]);
    const [values, setValues] = useState({
        web3: new Web3(window.ethereum),
        account: '',
        balance: '',
        contract: null,
        beneficiary: '',
        amount: '',
        buttonText: 'Create Will'
    });

    useEffect(() => {
        const init = async () => {
            if (window.ethereum) {
                await loadWeb3();
            }
            else {
                toast.error('Please connect to MetaMask!');
            }
        };
        init();
    }, []);

    const token = getCookie('token');
    const { web3, contract, account, balance, beneficiary, amount, buttonText } = values;

    const handleChange = (event) => {
        const { name, value } = event.target;
        setValues({ ...values, [name]: value });
    };

    const loadWeb3 = async () => {
        if (web3) {
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });

                const accounts = await web3.eth.getAccounts();
                const accountBalance = await web3.eth.getBalance(accounts[0]);
                const balanceInEth = web3.utils.fromWei(accountBalance, 'ether');

                const networkId = await web3.eth.net.getId();
                const deployedNetwork = Will.networks[networkId];
                const contractInstance = new web3.eth.Contract(Will.abi, deployedNetwork && deployedNetwork.address);

                setValues({ ...values, account: accounts[0], contract: contractInstance, balance: balanceInEth });
            }

            catch (err) {
                console.error('WEB3 LOADING FAILED:', err);
                // toast.error('Failed to load Web3 accounts!');
            }
        }
    };

    const handleCreateWill = async (event) => {
        event.preventDefault();
        setValues({ ...values, buttonText: 'Creating...' });

        if (!beneficiary || !amount) {
            toast.error('Both fields are required!');
            setValues({ ...values, buttonText: 'Create Will' });
            return;
        }

        if (contract && account) {
            try {
                const amountInWei = web3.utils.toWei(amount, 'ether');

                // First, deploy a new instance of the Will contract with the initial amount
                const newContractInstance = await new web3.eth.Contract(Will.abi)
                    .deploy({ data: Will.bytecode })
                    .send({ from: account, value: amountInWei });

                // Then, set the inheritance
                const receipt = await newContractInstance.methods
                    .setInheritance(beneficiary, amountInWei)
                    .send({ from: account });

                // Extract transaction details
                const txnHash = receipt.transactionHash;
                const contractAddress = receipt.to;
                const from = receipt.from;
                const to = beneficiary;
                const value = amount;

                const newWill = { txnHash, contractAddress, from, to, value, status: 'Pending' };
                // Update state
                const storeWills = [...wills, newWill];
                setWills(storeWills);

                // Store in localStorage
                localStorage.setItem('will', JSON.stringify(storeWills));

                await axios.post(
                    `${process.env.REACT_APP_API}/will/create`, newWill,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                    .then((response) => {
                        console.log('SAVE WILL SUCCESS:', response);
                        toast.success('Will created successfully!');
                        setValues({ ...values, contract: newContractInstance, beneficiary: '', amount: '', buttonText: 'Created' });
                    })
                    .catch((err) => {
                        console.log('SAVE WILL FAILED:', err.response.data.error);
                        setValues({ ...values, buttonText: 'Create Will' });
                    });
            }

            catch (err) {
                console.error('CREATE WILL FAILED:', err);
                toast.error('Failed to create will! Please try again.');
                setValues({ ...values, buttonText: 'Create Will' });
            }
        }
    };

    const handlePayout = async (event, index) => {
        event.preventDefault();

        if (!contract) {
            toast.error('Failed to load the contract!');
            return;
        }

        if (contract && account) {
            try {
                await contract.methods.hasDeceased().send({ from: account });
                toast.success('Payout executed Successfully!');

                // Update wills state
                const updatedWills = [...wills];
                const id = updatedWills[index].txnHash;
                updatedWills[index].status = 'Complete';
                setWills(updatedWills);

                localStorage.setItem('will', JSON.stringify(updatedWills));

                await axios.put(
                    `${process.env.REACT_APP_API}/will/update`, { txnHash: id, status: 'Complete' },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                    .then((response) => {
                        console.log('EXECUTE PAYOUT SUCCESS:', response);
                        toast.success('Payout executed Successfully!');
                    })
                    .catch((err) => {
                        console.log('EXECUTE PAYOUT FAILED:', err.response.data.error);
                    });
            }

            catch (err) {
                console.error('EXECUTE PAYOUT FAILED:', err.response.data.error);
                toast.error('Failed to execute payout! Please try again.');
            }
        }
    };

    const shortenAddress = (address) => {
        return `${address.slice(0, 5)}...${address.slice(-5)}`;
    };

    return (
        <Layout>
            <ToastContainer />
            {!isAuth() && <Navigate to='/signin' />}

            <section className="bg-gray-600 text-white py-14">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-5xl font-bold mb-2"> Create a Will </h1>
                </div>
            </section>

            <section className='mx-auto px-4 py-6 flex flex-col gap-8 bg-gray-100 shadow rounded'>
                <div className='px-10 flex items-center justify-between md:flex-row flex-col text-lg text-center gap-8'>
                    <div className='flex md:flex-row flex-col md:items-center gap-2'>
                        <span className='text-red-600 font-semibold'> Account: </span>
                        {!account ? (
                            <button onClick={loadWeb3}
                                className='py-2 px-4 font-semibold bg-white hover:opacity-80 border shadow rounded-md cursor-pointer'
                            >
                                Connect to MetaMask
                            </button>
                        ) : (
                            <div>
                                <span> {shortenAddress(account)}</span>
                                <CopyToClipboard text={account}>
                                    <button className='ml-2'>
                                        <MdOutlineContentCopy className='text-gray-500 hover:text-gray-800' />
                                    </button>
                                </CopyToClipboard>
                            </div>
                        )}
                    </div>

                    <div className='flex md:flex-row flex-col gap-2'>
                        <span className='text-red-600 font-semibold'> Balance: </span>
                        <span> {balance} ETH </span>
                    </div>
                </div>
            </section>

            <section className="max-w-lg m-auto text-center flex flex-col gap-4 px-4 py-10">
                <form onSubmit={handleCreateWill} className='p-10 flex flex-col shadow rounded gap-4 bg-gray-100'>
                    <input
                        type="text"
                        name="beneficiary"
                        value={beneficiary}
                        placeholder="Beneficiary Address"
                        onChange={handleChange}
                        className='p-3 shadow rounded'
                    />
                    <input
                        type="text"
                        name="amount"
                        value={amount}
                        placeholder="Amount in ETH"
                        onChange={handleChange}
                        className='p-3 shadow rounded'
                    />
                    <input
                        type='submit'
                        value={buttonText}
                        className='py-3 text-white font-semibold bg-red-500 hover:opacity-80 shadow rounded cursor-pointer'
                    />
                </form>
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
                                        <td className='px-6 py-4 whitespace-nowrap'>{will.value}</td>
                                        <td className='px-6 py-4 whitespace-nowrap'>{will.status}</td>

                                        {will.status === 'Pending' ? (
                                            <td className='px-6 py-4 whitespace-nowrap'>
                                                <button className='text-red-500 hover:opacity-80 font-medium' onClick={(event) => handlePayout(event, index)}>
                                                    Payout
                                                </button>
                                            </td>
                                        ) : (
                                            <td className='px-6 py-4 whitespace-nowrap'>
                                                <button disabled className='text-gray-400 font-medium'>
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

export default CreateWill;