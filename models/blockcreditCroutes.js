const mongoose = require('mongoose');

const BlockCreditC = new mongoose.Schema({

    creditCardNumber: {type: String  },

      cardHolderName: {type: String},
      ExpiryDate: {type: String },
      CVVNumber: {type: String },
      email:{ type: String},
      reason: {
        type: String,
        enum: ['Fraudulent Activity', 'Security Concerns', 'Suspicious Transactions', 'Late Payments', 'Exceeding Credit Limit', 'Lost or Stolen Card', 'Account Inactivity'],
      },     
      otp:{ type:String },
      StatusActive: {type: Boolean},
      StatusInactive: {type: Boolean}
})
const BlockCreditCard= mongoose.model(' BlockCreditCard', BlockCreditC);

module.exports = BlockCreditCard;