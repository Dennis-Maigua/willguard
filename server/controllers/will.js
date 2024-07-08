const Will = require('../models/will');

exports.create = async (req, res) => {
    const { txnHash, contractAddress, from, to, value, status } = req.body;

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
        return res.json(savedWill);
    }

    catch (error) {
        console.log('CREATE WILL FAILED:', err);
        res.status(400).json({
            error: 'Failed to create will! Please try again.'
        });
    }
};

exports.read = async (req, res) => {
    const { from } = req.params;

    try {
        const wills = await Will.find({ from });

        if (!wills) {
            return res.status(401).json({
                error: 'Wills not found!'
            });
        }

        // console.log('LOAD WILL SUCCESS:', req.user);
        console.log('LOAD WILL SUCCESS!');
        return res.json(wills);
    }

    catch (err) {
        console.log('LOAD WILL FAILED:', err);
        return res.status(500).json({
            error: 'Failed to read wills from database!'
        });
    }
};

exports.update = async (req, res) => {
    const { from } = req.params;
    const { status } = req.body;

    try {
        const will = await Will.find({ from });
        if (!will) {
            return res.status(401).json({
                error: 'User not found!'
            });
        }

        if (status) {
            will.status = status.trim();
        }

        const updatedWill = await will.save();

        // console.log('UPDATE WILL SUCCESS:', req.user);
        console.log('UPDATE WILL SUCCESS!');
        return res.json(updatedWill);
    }

    catch (err) {
        console.log('UPDATE WILL FAILED:', err);
        return res.status(500).json({
            error: 'Failed to update will! Please try again.'
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
            message: 'Failed to fetch will from database!'
        });
    }
};