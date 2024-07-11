const express = require('express');
const router = express.Router();

const { requireSignin, adminOnly } = require('../controllers/auth');
const { loadProfile, updateProfile, deleteAccount, fetchUsers,
    activeUsers, deleteUser } = require('../controllers/user');
const { updateValidator } = require('../validators/auth');
const { runValidation } = require('../validators');

router.get('/user/:id', requireSignin, loadProfile);
router.put('/user/update', requireSignin, updateValidator, runValidation, updateProfile);
router.delete('/user/delete', requireSignin, deleteAccount);
router.put('/admin/dashboard', requireSignin, adminOnly);
router.get('/users/fetch', requireSignin, adminOnly, fetchUsers);
router.get('/users/active', requireSignin, adminOnly, activeUsers);
router.put('/admin/update', requireSignin, adminOnly, updateValidator, runValidation, updateProfile);
router.delete('/admin/delete', requireSignin, adminOnly, deleteUser);

module.exports = router;