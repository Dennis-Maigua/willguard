const express = require('express');
const router = express.Router();

const { requireSignin, adminOnly } = require('../controllers/auth');
const { create, fetchWills, update } = require('../controllers/will');

router.post('/will/create', requireSignin, create);
router.get('/wills/fetch', requireSignin, adminOnly, fetchWills);
router.put('/will/update', requireSignin, update);
// router.get('/wills/:account', requireSignin, read);

module.exports = router;