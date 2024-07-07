const express = require('express');
const router = express.Router();

const { requireSignin, adminOnly } = require('../controllers/auth');
const { create, fetchWills } = require('../controllers/will');

router.post('/will/create', requireSignin, create);
router.get('/wills/fetch', requireSignin, adminOnly, fetchWills);

module.exports = router;