const Contact = require('../models/contact');

const { contactEntryTemplate, mailTransport } = require('../utils/mail');

exports.sendMessage = async (req, res) => {
    const { name, email, message } = req.body;

    try {
        const contactMessage = new Contact({ name, email, message });

        await contactMessage.save()
            .then(() => {
                mailTransport().sendMail({
                    from: email,
                    to: process.env.GMAIL_USER,
                    subject: 'Contact Form Entry',
                    html: contactEntryTemplate(name, email, message)
                });

                console.log('CONTACT ENTRY SUCCESS!');
                res.json({
                    success: true,
                    message: `Thank you for your message! We will get back to you soon.`
                });
            })
            .catch((err) => {
                console.log('EMAIL CONTACT ENTRY FAILED:', err);
                return res.status(500).json({
                    error: 'Failed to receive and email contact entry!'
                });
            });
    }

    catch (error) {
        console.error('SAVE CONTACT ENTRY FAILED:', error);
        res.status(500).json({
            error: 'Problem with saving contact entry in database!'
        });
    }
};