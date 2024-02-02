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
const UserOTP = mongoose.model('UserOTP', userOTPSchema);

module.exports = UserOTP;
