const mongoose = require('mongoose');


const userCreditCardPin  = new mongoose.Schema({
  userCreditcardpin : {type:String },
  confirmuserCreditcardpin : {type:String},
})

const creditcardTransactions = new mongoose.Schema({
  date : {type : Date},
  Referencenumber : {type: Number},
  transactionDetails : {type : String},
  transactionAmount : {type:Number},
  convertToEMI : {type : Boolean}
})

// const customerCreditCardLimitSchema = new mongoose.Schema({
//   creditCardNumber: { type: Number },
//   creditCardLimit: { type: Number },
//   totalAmountDue: { type: Number },
//   currentOutstanding: { type: Number },
//   availableCreditLimit: { type: Number },
//   userCreditCardcvv: { type: Number },
//   userCreditCardExpiryDate: { type: String },
//   userCreditCardStatus: { type: String },
//   userCreditCardPin: userCreditCardPin,
//   transactions : [creditcardTransactions]
// });


const transactionSchema = new mongoose.Schema({


  date: String,
  description: String,
  withdrawal: Number,
  deposit: Number,
  balance: Number,
});

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


const userDebitCardPin = new mongoose.Schema({
  userDebitcardpin: { type: String },
  confirmuserDebitcardpin: { type: String },
})

const userDebitCardDetails = new mongoose.Schema({
  userDebitCardNumber: { type: Number },
  userDebitCardcvv: { type: Number },
  userDebitCardExpiryDate: { type: String },
  userDebitCardStatus: { type: String },
  userDebitCardPin: userDebitCardPin,
  domesticLimits: domesticLimitSchema,
  internationalLimits: internationalLimitSchema,
  reissueCard : reissueCardSchema
});


const addressSchema = new mongoose.Schema({
  communicationAddress: { type: String },
  pincode: { type: String },
  state: { type: String },
  city: { type: String },
  village: { type: String },
});




const emiConversionSchema = new mongoose.Schema({
  emiTenure: { type: Number },
  processingFee: { type: Number },
  emi: { type: Number },
  totalEmi : {type:Number},
  isChecked: { type: Boolean },
  createdAt: { type: Date, default: Date.now }
});



const customerCreditCardLimitSchema = new mongoose.Schema({
  creditCardNumber: { type: String },
  creditCardLimit: { type: String },
  totalAmountDue: { type: String },
  currentOutstanding: { type: String },
  availableCreditLimit: { type: String },
  maximumCreditLimit: {type: String},
  
  userCreditCardcvv: { type: Number },
  userCreditCardExpiryDate: { type: String },
  userCreditCardStatus: { type: String },
  userCreditCardPin: userCreditCardPin,
  autoDebitSetup : { setupAutoDebit: { type: String },
  autodebitMode: { type: String },
  },
  atmWithdrawlStatus: {type: Boolean},
  atmTransactionLimit: {type: String},

  onlineTransactionStatus: {type: Boolean},
  onlineTransactionLimit: {type: String},

  merchantOutletStatus: {type: Boolean},
  merchantOutletTransLimit: {type: String},

  tapAndPayStatus: {type: Boolean},
  tapAndPayTransLimit: {type: String}
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


    firstName: { type: String },
    lastName: { type: String },
    address: {
        street: { type: String },

        city: { type: String }, 

        zipCode: { type: String }},
    accountHolderAddress: { type: addressSchema, default: {} },
    userAccountBalance: { type: Number },
    userDebitCardDetails: userDebitCardDetails,


    transactions: [transactionSchema],
    otp: {type: Number},

    
  
    creditCardTransactions : [creditcardTransactions],

    userCreditCardDetails : [customerCreditCardLimitSchema],

});




const UserDetailsAccounts = mongoose.model('userDetailsAccounts', userDetailsAccounts);


const payLaterAccount = new mongoose.Schema({

});
const PayLaterAccount = mongoose.model('payLaterAccount', payLaterAccount);
const userDetailsAccountsSchema = new mongoose.Schema({
  // Define the fields based on your frontend form
  vehicleRegNum: String,
  vehicleMake: String,
  vehicleModel: String,
  customerName: String,
  mobileNumber: String,
  emailId: String,
  address: String,
  pincode: String,
  city: String,
  state: String,
  // Include other fields as needed

  // Fields for purchase tab
  purchaseOrderNumber: Number,
  purchaseOrderNo: String,
  purchaseOrderDate: String,
  purchaseIssuesDate: String,
  agreeTerms: Boolean,

  // Fields for recharge
  rechargeType: String,
  vehicleRegistrationNumber: String,
  rechargeAmount: Number,
  debitAccount: String
});  



module.exports = { UserDetailsAccounts, PayLaterAccount };