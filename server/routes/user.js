const express = require('express');
const router = express.Router();

const { adminMiddleware, requireSignin } = require('../controllers/auth');
const { read, update, deleteUser, lockScreen } = require('../controllers/user');

router.get('/user/:id', requireSignin, read);
router.put('/user/update', requireSignin, update);
router.delete('/user/delete', requireSignin, deleteUser);
router.get('/admin/:id', requireSignin, read);
router.put('/admin/update', requireSignin, adminMiddleware, update);
router.delete('/admin/delete', requireSignin, deleteUser);
router.post('/lockscreen', requireSignin, lockScreen);

module.exports = router;