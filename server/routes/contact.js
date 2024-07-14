const express = require('express');
const router = express.Router();

const { requireSignin, adminOnly } = require('../controllers/auth');
const { sendMessage, update, fetchMessages, countByStatus } = require('../controllers/contact');

const { contactValidator } = require('../validators/auth');
const { runValidation } = require('../validators');

router.post('/message/send', contactValidator, runValidation, sendMessage);
router.put('/message/update', requireSignin, adminOnly, update);
router.get('/messages/fetch', requireSignin, adminOnly, fetchMessages);
router.get('/messages/count', requireSignin, adminOnly, countByStatus);

module.exports = router;