const mongoose = require('mongoose');

const willSchema = new mongoose.Schema(
    {
        txnHash: String,
        contractAddress: String,
        from: String,
        to: String,
        value: String,
        status: {
            type: String,
            default: 'Pending'
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Will', willSchema);