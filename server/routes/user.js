const express = require('express');
const router = express.Router();

const { requireSignin, adminOnly } = require('../controllers/auth');
const { read, update, deleteUser, lockscreen, fetchUsers, countActive } = require('../controllers/user');

router.get('/user/:id', requireSignin, read);
router.put('/user/update', requireSignin, update);
router.delete('/user/delete', requireSignin, deleteUser);
router.post('/lockscreen', requireSignin, lockscreen);
router.put('/dashboard', requireSignin, adminOnly);
router.get('/users/fetch', requireSignin, adminOnly, fetchUsers);
router.get('/users/active', requireSignin, adminOnly, countActive);

module.exports = router;