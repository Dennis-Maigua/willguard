const Will = require('../models/will');

exports.create = async (req, res) => {
    const { txnHash, contractAddress, from, to, value, status, payout } = req.body;

    const newWill = new Will({
        txnHash,
        contractAddress,
        from,
        to,
        value,
        status
    });

    try {
        const savedWill = await newWill.save();
        res.status(201).json(savedWill);
    }

    catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.read = async (req, res) => {
    try {
        const will = await Will.findById(req.user._id);
        if (!will) {
            return res.status(401).json({
                error: 'Will not found!'
            });
        }

        // console.log('LOAD USER WILL SUCCESS:', req.user);
        console.log('LOAD USER WILL SUCCESS!');
        return res.json(will);
    }

    catch (err) {
        console.log('READ WILL FAILED:', err);
        return res.status(500).json({
            error: 'Problem reading will from database!'
        });
    }
};

exports.fetchWills = async (req, res) => {
    try {
        const wills = await Will.find();

        console.log('READ WILL SUCCESS!');
        return res.json(wills);
    }

    catch (err) {
        console.log('READ WILL FAILED:', err);
        return res.status(500).json({
            message: 'Problem reading will from database!'
        });
    }
};