import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';

import { isAuth } from '../auth/helpers';
import Layout from './Layout';
import { Navigate } from 'react-router-dom';

const Dashboard = () => {
    const [activeComponent, setActiveComponent] = useState({
        name: 'Dashboard',
        header: 'Dashboard'
    });

    const renderContent = () => {
        switch (activeComponent.name) {
            case 'Dashboard':
                return <DashboardContent />;
            case 'Users':
                return <UsersContent />;
            case 'Analytics':
                return <AnalyticsContent />;
            case 'Wills':
                return <WillsContent />;
            default:
                return <DashboardContent />;
        }
    };

    return (
        <Layout>
            <ToastContainer />
            {!isAuth() ? <Navigate to='/' /> : null}
            <div className="flex min-h-screen bg-gray-100">
                <Sidebar activeComponent={activeComponent.name} setActiveComponent={setActiveComponent} />
                <div className="flex-1 p-6">
                    <Header headerName={activeComponent.header} />
                    <main className="mt-8">
                        {renderContent()}
                    </main>
                </div>
            </div>
        </Layout>
    );
};

const Sidebar = ({ activeComponent, setActiveComponent }) => {
    const isActive = (path) => {
        return path === activeComponent
            ? 'p-4 text-sm font-semibold text-red-500 bg-gray-100 cursor-pointer'
            : 'p-4 text-sm font-semibold hover:text-red-500 hover:bg-gray-100 cursor-pointer';
    };

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

const DashboardContent = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700"> 0 </h3>
                <p className="text-gray-500"> Total Wills </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700"> 2 </h3>
                <p className="text-gray-500"> Total Users </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700"> 1 </h3>
                <p className="text-gray-500"> Total Analytics </p>
            </div>
        </div>
    );
};

const WillsContent = () => {
    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Wills Content</h3>
            <p className="text-gray-500">Some wills content here.</p>
        </div>
    );
};

const UsersContent = () => {
    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <table className="min-w-full divide-y divide-gray-200 mt-4">
                <thead>
                    <tr>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profile</th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                        <td className="px-6 py-4 whitespace-nowrap">  </td>
                        <td className="px-6 py-4 whitespace-nowrap">  </td>
                        <td className="px-6 py-4 whitespace-nowrap">  </td>
                        <td className="px-6 py-4 whitespace-nowrap">  </td>
                        <td className="px-6 py-4 whitespace-nowrap">  </td>
                        <td className="px-6 py-4 whitespace-nowrap">  </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

const AnalyticsContent = () => {
    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <table className="min-w-full divide-y divide-gray-200 mt-4">
                <thead>
                    <tr>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profile</th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                        <td className="px-6 py-4 whitespace-nowrap">  </td>
                        <td className="px-6 py-4 whitespace-nowrap">  </td>
                        <td className="px-6 py-4 whitespace-nowrap">  </td>
                        <td className="px-6 py-4 whitespace-nowrap">  </td>
                        <td className="px-6 py-4 whitespace-nowrap">  </td>
                        <td className="px-6 py-4 whitespace-nowrap">  </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default Dashboard;