const { check } = require('express-validator');

exports.signupValidator = [
    check('name')
        .isLength({ min: 3 })
        .withMessage('Name must be at least 3 characters long!'),
    check('email')
        .isEmail()
        .withMessage('A valid email is required!'),
    check('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long!')
];

exports.signinValidator = [
    check('email')
        .isEmail()
        .withMessage('A valid email is required!'),
    check('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long!')
];

exports.forgotValidator = [
    check('email')
        .isEmail()
        .withMessage('A valid email is required!')
];

exports.resetValidator = [
    check('newPassword')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long!')
];