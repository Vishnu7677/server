const mongoose = require('mongoose');

const loanAccountSchema = new mongoose.Schema({
  accoutnumber: {
    type: Number,
    required: true,
  },
  sanctionedAmount: {
    type: Number,
    required: true,
  },
  principalAmount: {
    type: Number,
    required: true,
  },
  currentAmount: {
    type: Number,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  overdueAmount: {
    type: Number,
    default: 0,
  },
  
});

const LoanAccount = mongoose.model('LoanAccount', loanAccountSchema);

module.exports = LoanAccount;