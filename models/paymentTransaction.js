const mongoose = require('mongoose');

const paymentTransactionSchema = new mongoose.Schema({
    senderName: String,
    receiverName: String,
    accountNumber: String,
    phoneNumber: String,
    paymentTransferTime: String,
    transferDate: Date,
    ifscCode: String,
    transactionType: String,
    amount: Number,
    generatedDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('PaymentTransaction', paymentTransactionSchema);
