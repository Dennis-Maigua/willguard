const express = require('express');
const router = express.Router();

const { requireSignin, adminOnly } = require('../controllers/auth');
const { create, read, fetchWills, update } = require('../controllers/will');

router.post('/will/create', requireSignin, create);
router.get('/wills/:account', requireSignin, read);
router.put('/wills/update', requireSignin, update);
router.get('/wills/fetch', requireSignin, adminOnly, fetchWills);

module.exports = router;