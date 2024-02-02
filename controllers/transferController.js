const TransferTransaction = require('../models/transferTransaction');

exports.createTransferTransaction = async (req, res) => {
    try {
        const transferTransaction = new TransferTransaction(req.body);
        await transferTransaction.save();
        res.status(201).json(transferTransaction);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getTransferTransactions = async (req, res) => {
    try {
        const transferTransactions = await TransferTransaction.find();
        res.json(transferTransactions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};















 