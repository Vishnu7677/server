const PaymentTransaction = require('../models/paymentTransaction');

exports.createPaymentTransaction = async (req, res) => {
    try {
        const paymentTransaction = new PaymentTransaction(req.body);
        await paymentTransaction.save();
        res.status(201).json(paymentTransaction);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getPaymentTransactions = async (req, res) => {
    try {
        const paymentTransactions = await PaymentTransaction.find();
        res.json(paymentTransactions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};




























 