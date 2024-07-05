import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

import { isAuth, signout } from '../auth/helpers';
import Logo from '../assets/logo.png';
import Avatar from '../assets/avatar.png';

const Layout = ({ children }) => {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const [toggled, setToggled] = useState(false);
    const [dropdown, setDropdown] = useState(false);

    const isActive = (path) => {
        return pathname === path ? 'text-red-500' : 'text-white hover:text-red-500';
    }

    const handleLogout = async () => {
        const confirmDelete = window.confirm('Are you sure you want to log out?');

        if (confirmDelete) {
            signout(() => {
                navigate('/signin');
            });
        }
    };

    return (
        <div>
            <nav className='bg-gray-900 text-white'>
                <div className='max-w-7xl mx-auto px-4 py-6 flex items-center justify-between'>
                    <div>
                        <NavLink to='/' className='flex gap-2'>
                            <img src={Logo} className='h-8' alt='logo' />
                            <span className='text-2xl font-bold'> WillGuard </span>
                        </NavLink>
                    </div>

                    <div className={`md:bg-transparent bg-gray-800 md:static absolute md:p-0 p-8 left-0 md:w-auto w-full md:flex ${toggled ? 'block top-20' : 'hidden'}`}>
                        <ul className='flex md:flex-row flex-col md:gap-8 gap-6 font-medium'>
                            <li>
                                <NavLink to='/' className={`${isActive('/')}`}> Home </NavLink>
                            </li>
                            <li>
                                <NavLink to='/wills' className={`${isActive('/wills')}`}> Wills </NavLink>
                            </li>
                            <li>
                                <NavLink to='/about-us' className={`${isActive('/about-us')}`}> About Us </NavLink>
                            </li>
                            <li>
                                <NavLink to='/contact' className={`${isActive('/contact')}`}> Contact </NavLink>
                            </li>
                        </ul>
                    </div>

                    <div className='flex gap-4 font-semibold'>
                        {!isAuth() && (
                            <div className='flex gap-4'>
                                <NavLink to='/signin' className='py-2 px-5 text-sm text-black hover:text-white bg-white hover:bg-red-500 shadow rounded'> Sign In </NavLink>
                            </div>
                        )}

                        {isAuth() && isAuth().role === 'subscriber' && (
                            <div>
                                <div className='flex items-center gap-2 cursor-pointer' onMouseEnter={() => { setDropdown(!dropdown) }}>
                                    <img src={isAuth().profile || Avatar} alt='avatar' className='h-8 w-8 rounded-full object-cover border' />
                                    <span className=''> {isAuth().name} </span>
                                </div>

                                {dropdown ? (
                                    <div className='bg-gray-800 absolute right-3 top-20 p-8'>
                                        <ul className='flex flex-col gap-6'>
                                            <li>
                                                <NavLink to='/profile' className={`${isActive('/profile')}`}> Profile </NavLink>
                                            </li>
                                            <li>
                                                <NavLink to='/wills' className={`${isActive('/wills')}`}> Wills </NavLink>
                                            </li>
                                            <li>
                                                <NavLink to='/lockscreen' className={`${isActive('/lockscreen')}`}> Lock Screen </NavLink>
                                            </li>
                                            <li>
                                                <span onClick={handleLogout} className='hover:text-red-500 cursor-pointer'> Log Out </span>
                                            </li>
                                        </ul>
                                    </div>
                                )
                                    : null}
                            </div>
                        )}

                        {isAuth() && isAuth().role === 'admin' && (
                            <div>
                                <div className='flex items-center gap-2 cursor-pointer' onMouseEnter={() => { setDropdown(!dropdown) }}>
                                    <img src={isAuth().profile || Avatar} alt='avatar' className='h-8 w-8 rounded-full object-cover border' />
                                    <span> {isAuth().name} </span>
                                </div>

                                {dropdown ? (
                                    <div className='bg-gray-800 absolute md:right-4 right-12 top-20 p-6'>
                                        <ul className='flex flex-col gap-5'>
                                            <li>
                                                <NavLink to='/profile' className={`${isActive('/profile')}`}> Profile </NavLink>
                                            </li>
                                            <li>
                                                <NavLink to='/dashboard' className={`${isActive('/dashboard')}`}> Dashboard </NavLink>
                                            </li>
                                            <li>
                                                <NavLink to='/lockscreen' className={`${isActive('/lockscreen')}`}> Lock Screen </NavLink>
                                            </li>
                                            <li>
                                                <span onClick={handleLogout} className='hover:text-red-500 cursor-pointer'> Log Out </span>
                                            </li>
                                        </ul>
                                    </div>
                                )
                                    : null}
                            </div>
                        )}

                        <button
                            type='button'
                            className='md:hidden px-2 rounded-lg'
                            onClick={() => { setToggled(!toggled) }}
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {!toggled ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16m-7 6h7"
                                    />
                                )
                                    : (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    )
                                }
                            </svg>
                        </button>
                    </div>
                </div>
            </nav >

            <div className='min-h-screen flex-grow'>
                {children}
            </div>

            <footer className="bg-gray-900 text-white py-6 bottom-0">
                <div className="container mx-auto px-6 text-center">
                    <p className="text-sm">&copy; 2024 WillGuard. All rights reserved.</p>
                </div>
            </footer>
        </div >
    );
};

export default Layout;