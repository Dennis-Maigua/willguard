import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';

import { getCookie, isAuth } from '../auth/helpers';
import Layout from './Layout';
import Avatar from '../assets/avatar.png';

import { CopyToClipboard } from 'react-copy-to-clipboard';
import { MdOutlineContentCopy } from 'react-icons/md';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
    const [activeComponent, setActiveComponent] = useState({
        name: 'Dashboard',
        header: 'Dashboard'
    });

    const isActive = (path) => {
        return path === activeComponent
            ? 'p-4 text-sm font-semibold text-red-500 bg-gray-100 cursor-pointer'
            : 'p-4 text-sm font-semibold hover:text-red-500 hover:bg-gray-100 cursor-pointer';
    };

    const [users, setUsers] = useState([]);
    const [wills, setWills] = useState([]);
    const token = getCookie('token');

    useEffect(() => {
        const init = async () => {
            await fetchUsers();
            await fetchWills();
        };
        init();
    }, []);

    const renderContent = () => {
        switch (activeComponent.name) {
            case 'Dashboard':
                return <DashboardContent activeUsers={users} totalWills={wills} />;
            case 'Wills':
                return <WillsContent list={wills} />;
            case 'Users':
                return <UsersContent list={users} />;
            case 'Analytics':
                return <AnalyticsContent />;
            default:
                return <DashboardContent />;
        }
    };

    const fetchWills = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API}/wills/fetch`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log('FETCH WILLS SUCCESS:', response);
            setWills(response.data);
        }

        catch (err) {
            console.log('FETCH WILLS FAILED:', err.response.data.error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API}/users/fetch`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log('FETCH USERS SUCCESS:', response);
            setUsers(response.data);
        }

        catch (err) {
            console.log('FETCH USERS FAILED:', err.response.data.error);
        }
    };

    return (
        <Layout>
            <ToastContainer />
            {!isAuth() ? <Navigate to='/signin' /> : null}
            <div className="flex min-h-screen bg-gray-100">
                <Sidebar activeComponent={activeComponent.name}
                    setActiveComponent={setActiveComponent}
                    isActive={isActive}
                />
                <div className="flex-1 p-6">
                    <Header headerName={activeComponent.header} />
                    <main className="mt-6">
                        {renderContent()}
                    </main>
                </div>
            </div>
        </Layout>
    );
};

const Sidebar = ({ isActive, setActiveComponent }) => {
    return (
        <div className="w-64 bg-white shadow-md">
            <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-800">Admin</h1>
            </div>
            <nav className="mt-8 flex flex-col gap-1">
                <span onClick={() => setActiveComponent({ name: 'Dashboard', header: 'Dashboard' })} className={isActive('Dashboard')}> Dashboard </span>
                <span onClick={() => setActiveComponent({ name: 'Wills', header: 'Wills' })} className={isActive('Wills')}> Wills </span>
                <span onClick={() => setActiveComponent({ name: 'Users', header: 'Users' })} className={isActive('Users')}> Users </span>
                <span onClick={() => setActiveComponent({ name: 'Analytics', header: 'Analytics' })} className={isActive('Analytics')}> Analytics </span>
            </nav>
        </div>
    );
};

const Header = ({ headerName }) => {
    return (
        <header className="flex justify-between items-center py-4 px-6 bg-white border-b-4 border-red-500">
            <div>
                <h2 className="text-2xl font-semibold text-gray-800">{headerName}</h2>
            </div>
            <div>
                <button className="text-gray-600 focus:outline-none">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                    </svg>
                </button>
            </div>
        </header>
    );
};

const DashboardContent = ({ totalWills, activeUsers }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700"> 2 </h3>
                <p className="text-gray-500"> Pending Wills </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700"> 1 </h3>
                <p className="text-gray-500"> Completed Wills </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700"> {totalWills.length} </h3>
                <p className="text-gray-500"> Total Wills </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700"> {activeUsers.length} </h3>
                <p className="text-gray-500"> Active Users </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700"> 1 </h3>
                <p className="text-gray-500"> Deleted Users </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700"> 3 </h3>
                <p className="text-gray-500"> Total Users </p>
            </div>
        </div>
    );
};

const WillsContent = ({ list }) => {
    const shortenAddress = (address) => {
        return `${address.slice(0, 5)}...${address.slice(-5)}`;
    };

    return (
        <section className='mx-auto'>
            <div className='shadow rounded overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-200'>
                    <thead>
                        <tr>
                            <th className='px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'> Contract Address </th>
                            <th className='px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'> Txn Hash </th>
                            <th className='px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'> From </th>
                            <th className='px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'> To </th>
                            <th className='px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'> Value ETH </th>
                            <th className='px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'> Status </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {list.map((will) => (
                            <tr key={will._id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className='flex items-center'>
                                        <span>{shortenAddress(will.txnHash)}</span>
                                        <CopyToClipboard text={will.txnHash}>
                                            <button className='ml-2'>
                                                <MdOutlineContentCopy className='text-gray-500 hover:text-gray-800' />
                                            </button>
                                        </CopyToClipboard>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className='flex items-center'>
                                        <span>{shortenAddress(will.contractAddress)}</span>
                                        <CopyToClipboard text={will.contractAddress}>
                                            <button className='ml-2'>
                                                <MdOutlineContentCopy className='text-gray-500 hover:text-gray-800' />
                                            </button>
                                        </CopyToClipboard>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className='flex items-center'>
                                        <span>{shortenAddress(will.from)}</span>
                                        <CopyToClipboard text={will.from}>
                                            <button className='ml-2'>
                                                <MdOutlineContentCopy className='text-gray-500 hover:text-gray-800' />
                                            </button>
                                        </CopyToClipboard>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className='flex items-center'>
                                        <span>{shortenAddress(will.to)}</span>
                                        <CopyToClipboard text={will.to}>
                                            <button className='ml-2'>
                                                <MdOutlineContentCopy className='text-gray-500 hover:text-gray-800' />
                                            </button>
                                        </CopyToClipboard>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">{will.value}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{will.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

const UsersContent = ({ list }) => {
    const shortenId = (address) => {
        return `${address.slice(0, 5)}...${address.slice(-5)}`;
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <table className="min-w-full divide-y divide-gray-200 mt-4">
                <thead>
                    <tr>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> ID </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> Profile </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> Name </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> Email </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> Role </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> Actions </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {list.map((user) => (
                        <tr key={user._id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className='flex items-center'>
                                    <span>{shortenId(user._id)}</span>
                                    <CopyToClipboard text={user._id}>
                                        <button className='ml-2'>
                                            <MdOutlineContentCopy className='text-gray-500 hover:text-gray-800' />
                                        </button>
                                    </CopyToClipboard>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <img src={user.profileUrl || Avatar} alt="Profile" className="w-10 h-10 rounded-full" />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
                            <td className="px-6 py-4 whitespace-nowrap font-medium">
                                <button className="text-indigo-400 hover:text-indigo-700"> Edit </button>
                                <button className="text-red-500 hover:text-red-700 ml-4"> Delete </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const AnalyticsContent = () => {
    const usersData = {
        labels: ['Active Users', 'Deleted Users', 'Total Users'],
        datasets: [
            {
                label: '# of Users',
                data: [2, 1, 3],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.2)', // Active Users
                    'rgba(255, 99, 132, 0.2)', // Deleted Users
                    'rgba(75, 192, 192, 0.2)', // Total Users
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)', // Active Users
                    'rgba(255, 99, 132, 1)', // Deleted Users
                    'rgba(75, 192, 192, 1)', // Total Users
                ],
                borderWidth: 1,
            },
        ],
    };

    const willsData = {
        labels: ['Active Wills', 'Executed Wills', 'Total Wills'],
        datasets: [
            {
                label: '# of Wills',
                data: [2, 2, 4],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.2)', // Active Wills
                    'rgba(255, 159, 64, 0.2)', // Executed Wills
                    'rgba(153, 102, 255, 0.2)', // Total Wills
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)', // Active Wills
                    'rgba(255, 159, 64, 1)', // Executed Wills
                    'rgba(153, 102, 255, 1)', // Total Wills
                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <section className="flex flex-row gap-6">
            <div className="w-full md:w-1/2 p-10 bg-white rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">User Analytics</h3>
                <Pie data={usersData} />
            </div>
            <div className="w-full md:w-1/2 p-10 bg-white rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Wills Analytics</h3>
                <Pie data={willsData} />
            </div>
        </section>
    );
};

export default Dashboard;