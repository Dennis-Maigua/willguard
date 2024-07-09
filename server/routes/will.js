const express = require('express');
const router = express.Router();

const { requireSignin, adminOnly } = require('../controllers/auth');
const { create, fetchWills, update, countByStatus, willsTrends } = require('../controllers/will');

router.post('/will/create', requireSignin, create);
router.put('/will/update', requireSignin, update);
router.get('/wills/fetch', requireSignin, adminOnly, fetchWills);
router.get('/wills/count', requireSignin, adminOnly, countByStatus);
router.get('/wills/trends', requireSignin, adminOnly, willsTrends);

module.exports = router;