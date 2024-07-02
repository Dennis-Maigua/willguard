import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Signup from './auth/Signup';
import Signin from './auth/Signin';
import Activate from './auth/Activate';
import Forgot from './auth/Forgot';
import Reset from './auth/Reset';
import UserRoute from './auth/UserRoute';
import AdminRoute from './auth/AdminRoute';
import Profile from './core/Profile';
import LockScreen from './core/Lockscreen';
import Dashboard from './core/Dashboard';
import Wills from './components/Wills';
import About from './components/About';
import Contact from './components/Contact';

const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<App />} />
                <Route path='/signup' element={<Signup />} />
                <Route path='/signin' element={<Signin />} />
                <Route path='/activate-account/:token' element={<Activate />} />
                <Route path='/forgot-password' element={<Forgot />} />
                <Route path='/reset-password/:token' element={<Reset />} />
                <Route element={<UserRoute />}>
                    <Route path='/wills' element={<Wills />} />
                </Route>
                <Route element={<AdminRoute />}>
                    <Route path='/dashboard' element={<Dashboard />} />
                </Route>
                <Route path='/profile' element={<Profile />} />
                <Route path='/lockscreen' element={<LockScreen />} />
                <Route path='/about-us' element={<About />} />
                <Route path='/contact' element={<Contact />} />
            </Routes>
        </BrowserRouter>
    );
};

export default Router;