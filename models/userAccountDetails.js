const mongoose = require('mongoose');

const userDetailsAccounts = new mongoose.Schema({
    userAccountNumber: {type: Number},
    accountHolderName: {type: String},
    bankBranchName: {type: String},
    userAccountType: {type: String},
    userDateOfBirth: {type: String},
    userEmailId: {type: String},
    userMobileNumber: {type: Number},
    accountHolderPAN: {type: String},
    bankBranchIfscCode : {type: String},
    accountHolderAddress: {type: String},
    userAccountBalance: {type: String}
});

const UserDetailsAccounts = mongoose.model('userDetailsAccounts', userDetailsAccounts);

const payLaterAccount = new mongoose.Schema({
    accountNumber: Number,
    accountType: String,
    totalCreditLimit: String,
    utilisedLimit: String,
    availableLimit: String,
    amountDue: String,
    dueDate: String,
    lateFee: String,
    totalAdjustAmount: String,
    totalAmountPayable: String,
    billPeriod: String,
    paidAmount: Number,
    purchaseAmount:Number
  });
const PayLaterAccount = mongoose.model('payLaterAccount', payLaterAccount);

module.exports = {UserDetailsAccounts,PayLaterAccount};