const express = require('express');
const router = express.Router();

const { requireSignin, adminMiddleware } = require('../controllers/auth');
const { read, update, deleteUser, lockScreen, dashboard } = require('../controllers/user');

router.get('/profile/:id', requireSignin, read);
router.put('/profile/update', requireSignin, update);
router.delete('/profile/delete', requireSignin, deleteUser);
router.post('/lockscreen', requireSignin, lockScreen);
router.put('/dashboard', requireSignin, adminMiddleware);
router.get('/dashboard/users', requireSignin, adminMiddleware, dashboard);

module.exports = router;