const mongoose = require('mongoose');


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
  userDebitCardStatus: { type: Boolean },
  userDebitCardPin: userDebitCardPin,
  domesticLimits: domesticLimitSchema,
  internationalLimits: internationalLimitSchema,
});






const addressSchema = new mongoose.Schema({
  communicationAddress: { type: String },
  pincode: { type: String },
  state: { type: String },
  city: { type: String },
  village: { type: String },
});

const userDetailsAccounts = new mongoose.Schema({
  userAccountNumber: { type: Number },
  accountHolderName: { type: String },
  bankBranchName: { type: String },
  userAccountType: { type: String },
  userDateOfBirth: { type: String },
  userEmailId: { type: String },
  userMobileNumber: { type: String },
  otpCode: { type: String },
  accountHolderPAN: { type: String },
  bankBranchIfscCode: { type: String },

  firstName: { type: String },
  lastName: { type: String },
  address: {
    street: { type: String },
    city: { type: String },
    // Add more address details if necessary
    zipCode: { type: String }
  },

  accountHolderAddress: addressSchema,
  userAccountBalance: { type: String },
  userDebitCardDetails: userDebitCardDetails,
  otp: { type: Number }
});
const UserDetailsAccounts = mongoose.model('userDetailsAccounts', userDetailsAccounts);


const customerCreditCardLimitSchema = new mongoose.Schema({
  creditCardNumber: { type: String },
  creditCardLimit: { type: String },
  totalAmountDue: { type: String },
  currentOutstanding: { type: String },
  availableCreditLimit: { type: String }
});
const creditCardLimitSchema = new mongoose.Schema({
  customerAccountNumber: {type: String},
  customerName: {type: String},
  customerMailId: {type: String},
  customerMobileNumber: {type: String},
  customerCreditCardLimit: [customerCreditCardLimitSchema]
});
const CustomerCreditCardDetails = mongoose.model('CustomerCreditCardDetails', creditCardLimitSchema);



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
  purchaseAmount: Number
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

module.exports = { UserDetailsAccounts, PayLaterAccount, CustomerCreditCardDetails };
