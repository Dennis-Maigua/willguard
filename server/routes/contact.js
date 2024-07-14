const express = require('express');
const router = express.Router();

const { requireSignin, adminOnly } = require('../controllers/auth');
const { sendMessage, fetchMessages } = require('../controllers/contact');

const { contactValidator } = require('../validators/auth');
const { runValidation } = require('../validators');

router.post('/message/send', contactValidator, runValidation, sendMessage);
router.get('/messages/fetch', requireSignin, adminOnly, fetchMessages);

module.exports = router;