const nodemailer = require('nodemailer');

exports.mailTransport = () => {
    var transport = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.APP_PASSWORD
        },
        tls: {
            ciphers: "SSLv3"
        }
    });

    return transport;
};

exports.activateAccountTemplate = url => {
    return `
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <style>
                @media only screen and (max-width: 620px) {
                    h1 {
                        font-size: 20px;
                        padding: 5px;
                    }
                }
                div {
                    margin: 0 auto;
                    text-align: center;
                    font-family: sans-serif;
                    color: #272727;
                }
                h1 {
                    background: #f6f6f6;
                    padding: 10px;
                }
                button {
                    color: white;
                    background: #E8363C;
                    padding: 15px;
                    border-radius: 5px;
                    border: 0;
                    font-size: 16px;
                }
            </style>
        </head>
        <body>
            <div>
                <h1> Activation Pending </h1>                        
                <p> To activate your account, please use the following link: </p>
                <a href="${url}"> 
                    <button> Activate Now </button> 
                </a>
                <br />
                <p> This link is only valid for 1 hour and will expire after first use. </p>
            </div>
        </body>
    </html>
    `;
};

exports.activationSuccessTemplate = url => {
    return `
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <style>
                @media only screen and (max-width: 620px) {
                    h1 {
                        font-size: 20px;
                        padding: 5px;
                    }
                }
                div {
                    margin: 0 auto;
                    text-align: center;
                    font-family: sans-serif;
                    color: #272727;
                }
                h1 {
                    background: #f6f6f6;
                    padding: 10px;
                }
                button {
                    color: white;
                    background: #E8363C;
                    padding: 15px;
                    border-radius: 5px;
                    border: 0;
                    font-size: 16px;
                }
            </style>
        </head>
        <body>
            <div>
                <h1> Welcome to WillGuard </h1>
                <p> Your account has been activated successfully! </p>
                <a href="${url}"> 
                    <button> Sign In </button> 
                </a>
                <br />
                <p> Thank you for joining us. </p>
            </div>
        </body>
    </html>
    `;
};

exports.resetPasswordTemplate = url => {
    return `
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <style>
                @media only screen and (max-width: 620px) {
                    h1 {
                        font-size: 20px;
                        padding: 5px;
                    }
                }
                div {
                    margin: 0 auto;
                    text-align: center;
                    font-family: sans-serif;
                    color: #272727;
                }
                h1 {
                    background: #f6f6f6;
                    padding: 10px;
                }
                button {
                    color: white;
                    background: #E8363C;
                    padding: 15px;
                    border-radius: 5px;
                    border: 0;
                    font-size: 16px;
                }
            </style>
        </head>
        <body>
            <div>
                <h1> Reset Pending </h1>                        
                <p> To reset your password, please use the following link: </p>
                <a href="${url}"> 
                    <button> Reset Now </button> 
                </a>
                <br />
                <p> This link is only valid for 1 hour and will expire after use. </p>
            </div>
        </body>
    </html>
    `;
};

exports.resetSuccessTemplate = url => {
    return `
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <style>
                @media only screen and (max-width: 620px) {
                    h1 {
                        font-size: 20px;
                        padding: 5px;
                    }
                }
                div {
                    margin: 0 auto;
                    text-align: center;
                    font-family: sans-serif;
                    color: #272727;
                }
                h1 {
                    background: #f6f6f6;
                    padding: 10px;
                }
                button {
                    color: white;
                    background: #E8363C;
                    padding: 15px;
                    border-radius: 5px;
                    border: 0;
                    font-size: 16px;
                }
            </style>
        </head>
        <body>
            <div>
                <h1> Welcome Back </h1>
                <p> Your password has been reset successfully! </p>
                <a href="${url}"> 
                    <button> Sign In </button> 
                </a>
                <br />
                <p> If this was a mistake, please ignore this email or contact support. </p>
            </div>
        </body>
    </html>
    `;
};

exports.contactEntryTemplate = (name, email, message) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <style>
                @media only screen and (max-width: 620px) {
                    h1 {
                        font-size: 20px;
                        padding: 5px;
                    }
                }
                div {
                    margin: 0 auto;
                    font-family: sans-serif;
                    color: #272727;
                }
                h1 {
                    background: #f6f6f6;
                    padding: 10px;
                    text-align: center;
                }
                .container {
                    border: 1px dotted red;
                    border-radius: 4px;
                    padding: 10px;
                    margin: 15px;
                }
                p {
                    margin-bottom: 10px;
                }
                span {
                    text-align: center;
                }
            </style>
        </head>
        <body>
            <div>
                <h1> New Message </h1>
                <span> You have received a new contact entry from the website as follows: </span>
                <div class="container">
                    <p>
                        <strong> Name: </strong> ${name}
                    </p>
                    <p>
                        <strong> Email: </strong> ${email}
                    </p>
                    <p>
                        <strong> Message: </strong> ${message}
                    </p>
                </div>
                <span> If this was a spam email, please delete it or mark as spam. </span>
            </div>
        </body>
    </html>
    `;
};