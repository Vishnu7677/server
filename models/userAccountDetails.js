const mongoose = require('mongoose');

const userDebitCardPin  = new mongoose.Schema({
  userDebitcardpin : {type:String },
  confirmuserDebitcardpin : {type:String},
})


const userDebitCardDetails = new mongoose.Schema({
  userDebitCardNumber: { type: Number },
  userDebitCardcvv: { type: Number },
  userDebiitCardExpiryDate: {type: String},
  userDebitCardStatus :{type: String, default: 'active' },
  userDebitCardPin : userDebitCardPin
})


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
    accountHolderAddress: {type: String},
    userAccountBalance: {type: String},
    userDebitCardDetails: userDebitCardDetails,
    otp: {type: Number},
});

const UserDetailsAccounts = mongoose.model('userDetailsAccounts', userDetailsAccounts);



module.exports = UserDetailsAccounts;