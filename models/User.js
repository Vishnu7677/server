const mongoose = require('mongoose');
 
const userInward = new mongoose.Schema({
  accountNumber: String, // New field to store selected account number
  beneficiaryName: String,
  beneficiaryAddress: String,
  beneficiaryAccountNumber: String,
  beneficiaryIfscCode: String,
  PhoneNumber: String,
  reviewAccuracy: Boolean,
  purposeOfRemittance: String,
  bookFXDeal: Boolean,
});

module.exports = mongoose.model('UserINRM', userInward);
