const mongoose = require('mongoose');

// Define schema
const userOTPSchema = new mongoose.Schema({
  mobileNumber: {
    type: String,
    required: true,
    unique: true,
  },
  otp: {
    type: String,
    required: true,
  },
 
});

// Define model
const TaxcenterOTP = mongoose.model('TaxcenterOTP', userOTPSchema);

module.exports = TaxcenterOTP;
