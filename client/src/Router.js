import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Signup from './auth/Signup';
import Signin from './auth/Signin';
import Activate from './auth/Activate';
import Forgot from './auth/Forgot';
import Reset from './auth/Reset';
import User from './core/User';
import Admin from './core/Admin';
import UserRoute from './auth/UserRoute';
import AdminRoute from './auth/AdminRoute';
import LockScreen from './core/Lockscreen';
import Wills from './components/Wills';

const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<App />} />
                <Route path='/wills' element={<Wills />} />
                <Route path='/signup' element={<Signup />} />
                <Route path='/signin' element={<Signin />} />
                <Route path='/lockscreen' element={<LockScreen />} />
                <Route path='/activate-account/:token' element={<Activate />} />
                <Route path='/forgot-password' element={<Forgot />} />
                <Route path='/reset-password/:token' element={<Reset />} />
                <Route element={<UserRoute />}>
                    <Route path='/user' element={<User />} />
                </Route>
                <Route element={<AdminRoute />}>
                    <Route path='/admin' element={<Admin />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default Router;