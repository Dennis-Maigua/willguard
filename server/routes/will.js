const express = require('express');
const router = express.Router();

const { requireSignin, adminOnly } = require('../controllers/auth');
const { create, read, fetchWills } = require('../controllers/will');

router.post('/will/create', requireSignin, create);
router.get('/wills/fetch', requireSignin, adminOnly, fetchWills);
router.get('/wills/:account', requireSignin, read);

module.exports = router;