const mongoose = require('mongoose');

const domesticLimitSchema = new mongoose.Schema({
  cashWithdrawalLimit: { type: Number, default: 0 },
  retailTransactionLimit: { type: Number, default: 0 },
  ecommerceTransactionLimit: { type: Number, default: 0 },
  contactlessPaymentLimit: { type: Number, default: 0 },
});

const internationalLimitSchema = new mongoose.Schema({
  cashWithdrawalLimit: { type: Number, default: 0 },
  retailTransactionLimit: { type: Number, default: 0 },
  ecommerceTransactionLimit: { type: Number, default: 0 },
  contactlessPaymentLimit: { type: Number, default: 0 },
});

const userDebitCardPin = new mongoose.Schema({
  userDebitcardpin: { type: String },
  confirmuserDebitcardpin: { type: String },
});

const userDebitCardDetails = new mongoose.Schema({
  userDebitCardNumber: { type: Number },
  userDebitCardcvv: { type: Number },
  userDebitCardExpiryDate: { type: String },
  userDebitCardStatus: { type: Boolean },
  userDebitCardPin: userDebitCardPin,
  domesticLimits: domesticLimitSchema,
  internationalLimits: internationalLimitSchema,
});

const userDetailsAccounts = new mongoose.Schema({
  userAccountNumber: { type: Number },
  accountHolderName: { type: String },
  bankBranchName: { type: String },
  userAccountType: { type: String },
  userDateOfBirth: { type: String },
  userEmailId: { type: String },
  userMobileNumber: { type: String },
  accountHolderPAN: { type: String },
  bankBranchIfscCode: { type: String },
  accountHolderAddress: { type: String },
  userAccountBalance: { type: String },
  userDebitCardDetails: userDebitCardDetails,
  otp:{type:Number}
});

const UserDetailsAccounts = mongoose.model('UserDetailsAccounts', userDetailsAccounts);

module.exports = UserDetailsAccounts;