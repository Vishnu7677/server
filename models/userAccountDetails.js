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

  userDebitCardExpiryDate: { type: String },
  userDebitCardStatus: { type: Boolean },
  userDebitCardPin: userDebitCardPin,
  domesticLimits: domesticLimitSchema,
  internationalLimits: internationalLimitSchema,
});



const UserDetailsAccounts = mongoose.model('UserDetailsAccounts', userDetailsAccounts);
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

    
    otpCode: {type: String},

    accountHolderPAN: {type: String},
    bankBranchIfscCode : {type: String},
    accountHolderAddress: { type: addressSchema, default: {} },
    userAccountBalance: {type: String},
    userDebitCardDetails: userDebitCardDetails,
    otp: {type: Number},
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




