const express = require('express');
const router = express.Router();

const { requireSignin, adminOnly } = require('../controllers/auth');
const { read, update, deleteUser, fetchUsers, countActive } = require('../controllers/user');

router.get('/user/:id', requireSignin, read);
router.put('/user/update', requireSignin, update);
router.delete('/user/delete', requireSignin, deleteUser);
router.put('/dashboard', requireSignin, adminOnly);
router.get('/users/fetch', requireSignin, adminOnly, fetchUsers);
router.get('/users/active', requireSignin, adminOnly, countActive);
router.put('/admin/update', requireSignin, adminOnly, update);
router.delete('/admin/delete', requireSignin, adminOnly, deleteUser);

module.exports = router;