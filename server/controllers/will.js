const Will = require('../models/will');

exports.create = async (req, res) => {
    const { txnHash, contractAddress, from, to, value, status } = req.body;

    const newWill = new Will({ txnHash, contractAddress, from, to, value, status });

    try {
        const savedWill = await newWill.save();
        return res.json(savedWill);
    }

    catch (error) {
        console.log('CREATE WILL FAILED:', err);
        res.status(400).json({
            error: 'Failed to create will!'
        });
    }
};

exports.update = async (req, res) => {
    const { txnHash, status } = req.body;

    try {
        const will = await Will.findOne({ txnHash });
        if (!will) {
            return res.status(404).json({
                error: 'Will not found!'
            });
        }

        will.status = status.trim();
        const updatedWill = await will.save();

        console.log('UPDATE WILL SUCCESS:', updatedWill);
        return res.json(updatedWill);
    }

    catch (err) {
        console.log('UPDATE WILL FAILED:', err);
        return res.status(500).json({
            error: 'Failed to update will!'
        });
    }
};

exports.fetchWills = async (req, res) => {
    try {
        const wills = await Will.find();

        console.log('FETCH WILLS SUCCESS!');
        return res.json(wills);
    }

    catch (err) {
        console.log('FETCH WILLS FAILED:', err);
        return res.status(500).json({
            message: 'Failed to fetch wills from database!'
        });
    }
};

exports.countByStatus = async (req, res) => {
    try {
        const pending = await Will.countDocuments({ status: 'Pending' });
        const complete = await Will.countDocuments({ status: 'Complete' });

        return res.json({
            pending,
            complete
        });
    }

    catch (err) {
        console.log('COUNTING WILLS FAILED:', err);
        return res.status(500).json({
            error: 'Failed to count will!'
        });
    }
}

exports.willTrends = async (req, res) => {
    try {
        const trends = await Will.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                        day: { $dayOfMonth: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
        ]);

        return res.json(trends);
    }

    catch (err) {
        console.log('WILL CREATION TRENDS FAILED:', err);
        return res.status(500).json({ error: 'Failed to fetch will creation trends!' });
    }
};

exports.loadUserWills = async (req, res) => {
    const { from } = req.params.id;

    try {
        const wills = await Will.find({ from: from });
        if (!wills) {
            return res.status(404).json({
                error: 'User wills not found!'
            });
        }

        console.log('LOAD USER WILLS SUCCESS:', wills)
        return res.json(wills);
    }

    catch (err) {
        console.log('LOAD USER WILLS FAILED:', err);
        return res.status(500).json({
            error: 'Failed to load user wills! Please try again.'
        });
    }
}
