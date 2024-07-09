import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';

import { getCookie, isAuth } from '../auth/helpers';
import Layout from './Layout';
import Avatar from '../assets/avatar.png';

import { CopyToClipboard } from 'react-copy-to-clipboard';
import { MdOutlineContentCopy } from 'react-icons/md';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const Dashboard = () => {
    const [wills, setWills] = useState([]);
    const [users, setUsers] = useState([]);
    const [willTrends, setWillTrends] = useState([]);

    const [willCounts, setWillCounts] = useState({
        pending: 0,
        complete: 0
    });
    const [userCounts, setUserCounts] = useState({
        active: 0,
        inactive: 0
    });
    const [activeComponent, setActiveComponent] = useState({
        name: 'Dashboard',
        header: 'Dashboard'
    });

    useEffect(() => {
        const init = async () => {
            await fetchWills();
            await countWills();
            await fetchTrends();
            await fetchUsers();
            await countActive();
        };
        init();
    }, []);

    const token = getCookie('token');

    const fetchWills = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API}/wills/fetch`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log('FETCH WILLS SUCCESS:', response);
            setWills(response.data);
        }

        catch (err) {
            console.log('FETCH WILLS FAILED:', err.response.data.error);
        }
    };

    const countWills = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API}/wills/count`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log('COUNT WILLS SUCCESS:', response);
            setWillCounts(response.data);
        }
        catch (err) {
            console.log('COUNT WILLS FAILED:', err.response.data.error);
        }
    }

    const fetchTrends = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API}/wills/trends`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log('WILL TRENDS SUCCESS:', response);
            setWillTrends(response.data);
        }
        catch (err) {
            console.log('WILL TRENDS FAILED:', err.response.data.error);
        }
    }

    const fetchUsers = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API}/users/fetch`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log('FETCH USERS SUCCESS:', response);
            setUsers(response.data);
        }

        catch (err) {
            console.log('FETCH USERS FAILED:', err.response.data.error);
        }
    };

    const countActive = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API}/users/active`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log('ACTIVE USERS SUCCESS:', response);
            setUserCounts(response.data);
        }

        catch (err) {
            console.log('ACTIVE USERS FAILED:', err.response.data.error);
        }

    }

    const isActive = (path) => {
        return path === activeComponent
            ? 'p-4 text-sm font-semibold text-red-500 bg-gray-100 cursor-pointer'
            : 'p-4 text-sm font-semibold hover:text-red-500 hover:bg-gray-100 cursor-pointer';
    };

    const renderContent = () => {
        switch (activeComponent.name) {
            case 'Dashboard':
                return <DashboardContent totalWills={wills} pendingWills={willCounts.pending}
                    completeWills={willCounts.complete} totalUsers={users} activeUsers={userCounts.active}
                    willTrends={willTrends} inactiveUsers={users.length - userCounts.active} />;
            case 'Wills':
                return <WillsContent list={wills} />;
            case 'Users':
                return <UsersContent list={users} token={token} />;
            default:
                return <DashboardContent />;
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
        <div className="w-64 bg-white shadow">
            <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-800">Admin</h1>
            </div>
            <nav className="mt-8 flex flex-col gap-1">
                <span onClick={() => setActiveComponent({ name: 'Dashboard', header: 'Dashboard' })} className={isActive('Dashboard')}> Dashboard </span>
                <span onClick={() => setActiveComponent({ name: 'Wills', header: 'Wills' })} className={isActive('Wills')}> Wills </span>
                <span onClick={() => setActiveComponent({ name: 'Users', header: 'Users' })} className={isActive('Users')}> Users </span>
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

const DashboardContent = ({ pendingWills, completeWills, totalWills, willTrends, totalUsers, activeUsers, inactiveUsers }) => {
    const willsData = {
        labels: ['Pending', 'Complete'],
        datasets: [
            {
                label: 'Count',
                data: [pendingWills, completeWills],
                backgroundColor: [
                    'rgba(255, 159, 64, 0.2)', // Pending Wills
                    'rgba(153, 102, 255, 0.2)', // Complete Wills
                ],
                borderColor: [
                    'rgba(255, 159, 64, 1)', // Pending Wills
                    'rgba(153, 102, 255, 1)', // Complete Wills
                ],
                borderWidth: 1,
            },
        ],
    };

    const usersData = {
        labels: ['Active', 'Inactive'],
        datasets: [
            {
                label: 'Count',
                data: [activeUsers, inactiveUsers],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.2)', // Active Users
                    'rgba(255, 99, 132, 0.2)', // Inactive Users
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)', // Active Users
                    'rgba(255, 99, 132, 1)', // Inactive Users
                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className='flex flex-col gap-8'>
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-6 bg-white rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-700"> {pendingWills} </h3>
                    <p className="text-gray-500"> Pending Wills </p>
                </div>

                <div className="p-6 bg-white rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-700"> {completeWills} </h3>
                    <p className="text-gray-500"> Complete Wills </p>
                </div>

                <div className="p-6 bg-white rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-700"> {totalWills.length} </h3>
                    <p className="text-gray-500"> Total Wills </p>
                </div>

                <div className="p-6 bg-white rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-700"> {activeUsers} </h3>
                    <p className="text-gray-500"> Active Users </p>
                </div>

                <div className="p-6 bg-white rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-700"> {inactiveUsers} </h3>
                    <p className="text-gray-500"> Inactive Users </p>
                </div>

                <div className="p-6 bg-white rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-700"> {totalUsers.length} </h3>
                    <p className="text-gray-500"> Total Users </p>
                </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-6 bg-white rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4"> Number of Wills </h3>
                    <Pie data={willsData} />
                </div>

                <div className="p-6 bg-white rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4"> Number of Users </h3>
                    <Pie data={usersData} />
                </div>

                <div className="p-6 bg-white rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4"> Wills Trends </h3>
                    <Line
                        data={{
                            labels: willTrends.map(trend => `${trend._id.month}/${trend._id.day}/${trend._id.year}`),
                            datasets: [
                                {
                                    label: 'Wills Created',
                                    data: willTrends.map(trend => trend.count),
                                    borderColor: 'rgba(75,192,192,1)',
                                    fill: false,
                                }
                            ]
                        }}
                    />
                </div>
            </section>
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

const UsersContent = ({ list, token }) => {
    const [editUser, setEditUser] = useState(null);
    const [role, setRole] = useState('');
    const [profile, setProfile] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');

    const handleEditClick = (user) => {
        setRole(user.role);
        setProfile(user.profile);
        setEditUser(user);
        setName(user.name);
        setEmail(user.email);
        setPhone(user.phone);
        setAddress(user.address);
    };

    const handleUpdateUser = async () => {
        try {
            const response = await axios.put(
                `${process.env.REACT_APP_API}/admin/update`,
                { userId: editUser._id, role, profile, name, email, phone, address },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            console.log('User updated:', response.data);
            // Update the user list with the new data (optional)
            setEditUser(null);
        }

        catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            const response = await axios.delete(
                `${process.env.REACT_APP_API}/admin/delete`,
                { data: { userId } },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log('User deleted:', response.data);
            // Update the user list by removing the deleted user (optional)
        }

        catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const shortenId = (address) => {
        return `${address.slice(0, 5)}...${address.slice(-5)}`;
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow">
            {editUser && (
                <div className="mb-4">
                    <h3>Edit User</h3>
                    <form onSubmit={handleUpdateUser}>
                        <label>
                            Role:
                            <input
                                type="text"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                required
                            />
                        </label>
                        <label>
                            Profile URL:
                            <input
                                type="text"
                                value={profile}
                                onChange={(e) => setProfile(e.target.value)}
                            />
                        </label>
                        <label>
                            Name:
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </label>
                        <label>
                            Email:
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </label>
                        <label>
                            Phone:
                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                        </label>
                        <label>
                            Address:
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </label>
                        <button type="submit"> Update User </button>
                        <button type="button" onClick={() => setEditUser(null)}> Cancel </button>
                    </form>
                </div>
            )}
            <table className="min-w-full divide-y divide-gray-200 mt-4">
                <thead>
                    <tr>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> Role </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> Profile </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> Name </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> Email </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> Phone </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> Address </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> Actions </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {list.map((user) => (
                        <tr key={user._id}>
                            <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className='flex items-center'>
                                    <img src={user.profile || Avatar} alt="Profile" className="w-10 h-10 rounded-full" />
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{user.phone}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{user.address}</td>
                            <td className="px-6 py-4 whitespace-nowrap font-medium">
                                <button className="text-blue-400 hover:text-blue-700" onClick={() => handleEditClick(user)}> Edit </button>
                                <button className="text-red-500 hover:text-red-700 ml-4" onClick={() => handleDeleteUser(user._id)}> Delete </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Dashboard;