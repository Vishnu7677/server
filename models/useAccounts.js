const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  flatnumber: String,
  buildingname: String,
  landmark: String,
  city: String,
  state: String,
  country: String,
  pincode: String,
  permanantAddressStatus:String
});

const jointAccountDetailsSchema = new mongoose.Schema({
  prefix: String,
  firstname: String,
  lastname: String,
  aadharnumber: String,
  pannumber: String,
  mobilenumber: String,
  fathername: String,
  mothername: String,
  gaurdianname: String,
});

const userAccountDetailsSchema = new mongoose.Schema({
  dateofbirth: String,
  email: String,
  mobilenumber: String,
  openaccount: String,
  operatingtype: String,
  prefix: String,
  firstname: String,
  lastname: String,
  aadharnumber: String,
  pannumber: String,
  fathername: String,
  mothername: String,
  gaurdianname: String,
  jointAccountStatus:String,
  currentAddress: addressSchema,
  permanentAddress: addressSchema,
  jointAccountDetails: jointAccountDetailsSchema,
  declaration:String,
  otp: String,
  otpExpiration: Date,
  accountNumber: String,
  ifscCode: String,
  netBankingUserID: String,
  netBankingPassword : String
});

const UserDetails = mongoose.model("UserDetails", userAccountDetailsSchema);

module.exports = { UserDetails };
