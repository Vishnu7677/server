const mongoose = require('mongoose');

const transferTransactionSchema = new mongoose.Schema({
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

module.exports = mongoose.model('TransferTransaction', transferTransactionSchema);
