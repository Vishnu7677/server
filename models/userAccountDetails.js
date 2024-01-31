const mongoose = require('mongoose');


const reissueCardSchema = new mongoose.Schema({
  srn: { type: String, unique: true }
});


const userDebitCardPin  = new mongoose.Schema({
  userDebitcardpin : {type:String },
  confirmuserDebitcardpin : {type:String},
})


const userDebitCardDetails = new mongoose.Schema({
  userDebitCardNumber: { type: Number },
  userDebitCardcvv: { type: Number },
  userDebiitCardExpiryDate: {type: String},
  userDebitCardStatus :{type: String, default: 'active' },
  userDebitCardPin : userDebitCardPin,
  reissueCard : reissueCardSchema
})

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
    userDebitCardDetails: userDebitCardDetails,
    otp: {type: Number},
});

const UserDetailsAccounts = mongoose.model('userDetailsAccounts', userDetailsAccounts);


module.exports = UserDetailsAccounts;