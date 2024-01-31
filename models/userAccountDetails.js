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
    userAccountBalance: {type: String},
    firstName: { type: String },
    lastName: { type: String },
    address: {
        street: { type: String },
        city: { type: String },
        // Add more address details if necessary
        zipCode: { type: String }}
});

const UserDetailsAccounts = mongoose.model('userDetailsAccounts', userDetailsAccounts);

module.exports = UserDetailsAccounts;