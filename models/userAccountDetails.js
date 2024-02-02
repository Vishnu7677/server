const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  date: String,
  description: String,
  withdrawal: Number,
  deposit: Number,
  balance: Number,
});
const addressSchema = new mongoose.Schema({
  communicationAddress: { type: String },
  pincode: { type: String },
  state: { type: String },
  city: { type: String },
  village: { type: String },
});
const userDetailsAccounts = new mongoose.Schema({
     userAccountNumber: {type: Number},
    accountHolderName: {type: String},
    bankBranchName: {type: String},
    userAccountType: {type: String},
    userDateOfBirth: {type: String},
    userEmailId: {type: String},
    userMobileNumber: {type: String},
    accountHolderPAN: {type: String},
    bankBranchIfscCode : {type: String},
    accountHolderAddress: { type: addressSchema, default: {} },
        userAccountBalance: {type: String},
    transactions: [transactionSchema],
    otp: {type: Number},

});

const UserDetailsAccounts = mongoose.model('userDetailsAccounts', userDetailsAccounts);

  module.exports = UserDetailsAccounts;