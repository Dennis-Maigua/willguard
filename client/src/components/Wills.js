import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import Web3 from 'web3';
import Layout from '../core/Layout';
import { isAuth } from '../auth/helpers';
import Will from '../truffle_abis/Will.json';

const Wills = () => {
    const [transactions, setTransactions] = useState([]);
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

    const { web3, account, balance, contract, beneficiary, amount, buttonText } = values;

    const handleChange = (event) => {
        const { name, value } = event.target;
        setValues({ ...values, [name]: value });
    };

    const loadWeb3 = async () => {
        if (web3) {
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const accounts = await web3.eth.getAccounts();

                setValues({ ...values, account: accounts[0] });
                await loadBlockchainData(accounts[0]);
            }

            catch (err) {
                toast.error('Failed to load Web3 accounts!');
                console.error('Error loading Web3:', err);
            }
        }
    };

    const loadBlockchainData = async (myAccount) => {
        try {
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = Will.networks[networkId];

            if (deployedNetwork) {
                const contractInstance = new web3.eth.Contract(Will.abi, deployedNetwork.address);
                const accountBalance = await web3.eth.getBalance(myAccount);
                const balanceInEth = web3.utils.fromWei(accountBalance, 'ether');

                setValues({ ...values, account: myAccount, contract: contractInstance, balance: balanceInEth });
            }

            else {
                console.error('Contract is not deployed on the current network!');
            }
        }

        catch (err) {
            console.error('Error loading blockchain data:', err);
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
            // const contractAddress = receipt.to;
            const contractAddress = newContractInstance.options.address;
            const from = account;
            const to = beneficiary;
            const value = amount;

            toast.success('Will created successfully!');
            setTransactions([...transactions, { txnHash, contractAddress, from, to, value }]);
            setValues({ ...values, beneficiary: '', amount: '', buttonText: 'Created' });
        }

        catch (err) {
            toast.error('Will creation failed! Please connect to MetaMask and try again.');
            console.error('Error creating will:', err);
            setValues({ ...values, buttonText: 'Create Will' });
        }
    };

    const handlePayout = async (event) => {
        event.preventDefault();

        if (!contract) {
            toast.error('Failed to load the contract!');
            return;
        }

        try {
            // Estimate gas manually
            const gas = await contract.methods.hasDeceased().estimateGas({ from: account });
            await contract.methods.hasDeceased().send({ from: account, gas });

            toast.success('Payout executed successfully!');
            // Optionally, update the transaction list or perform other actions here
        }

        catch (err) {
            toast.error('Failed to execute payout! Please try again.');
            console.error("Error executing payout: ", err);
        }
    };

    return (
        <Layout>
            <ToastContainer />
            {!isAuth() && <Navigate to='/signin' />}

            <section className="bg-gray-600 text-white py-14">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-5xl font-bold mb-2"> Wills </h1>
                </div>
            </section>

            <section className='mx-auto px-4 py-6 flex flex-col gap-8 bg-gray-100 shadow rounded'>
                <div className='px-10 flex items-center justify-between md:flex-row flex-col text-lg text-center gap-8'>
                    <div className='flex md:flex-row flex-col md:items-center gap-2 '>
                        <span className='text-red-600 font-semibold'> Account: </span>
                        {!account ? (
                            <button onClick={loadWeb3}
                                className='py-2 px-4 font-semibold bg-blue-500 text-white hover:opacity-80 shadow rounded cursor-pointer'
                            >
                                Connect to MetaMask
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

            <div className="max-w-lg m-auto text-center flex flex-col gap-4 px-4 py-10">
                <form onSubmit={handleCreateWill} className='p-10 flex flex-col shadow-md rounded gap-4 bg-gray-100'>
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
                            {transactions.length > 0 ? (
                                transactions.map((txn, index) => (
                                    <tr key={index}>
                                        <td className='px-6 py-4 whitespace-nowrap'> {txn.contractAddress} </td>
                                        <td className='px-6 py-4 whitespace-nowrap'> {txn.txnHash} </td>
                                        <td className='px-6 py-4 whitespace-nowrap'> {txn.from} </td>
                                        <td className='px-6 py-4 whitespace-nowrap'> {txn.to} </td>
                                        <td className='px-6 py-4 whitespace-nowrap'> {txn.value} </td>
                                        <td className='px-6 py-4 whitespace-nowrap font-medium'>
                                            <button onClick={handlePayout} className='text-red-500 hover:text-red-700'> Payout </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td className='px-6 py-4 whitespace-nowrap text-center' colSpan='6'> No transactions found. </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </Layout>
    );
};

export default Wills;
