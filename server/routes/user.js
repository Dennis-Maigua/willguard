const express = require('express');
const router = express.Router();

// const { adminMiddleware, requireSignin } = require('../controllers/auth');
const { requireSignin } = require('../controllers/auth');
const { read, update, deleteUser, lockScreen } = require('../controllers/user');

router.get('/profile/:id', requireSignin, read);
router.put('/profile/update', requireSignin, update);
router.delete('/profile/delete', requireSignin, deleteUser);
// router.put('/admin/update', requireSignin, adminMiddleware, update);
router.post('/lockscreen', requireSignin, lockScreen);

module.exports = router;