const mongoose = require('mongoose');

const quickFundTransferSchema = new mongoose.Schema({
    transferType: { type: String },
    transferForm: { type: String },
    toAccountNumber: { type: Number },
    confirmAccountNumber: { type: Number },
    payeeName: { type: String },
    amount: { type: Number },
    remarks: { type: String },
  });
  
const QuickFundTransferModel = mongoose.model('QuickFundTransfer', quickFundTransferSchema);


const applicantSchema = new mongoose.Schema({
    vehicleRegNum: { type: String, required: true },
    vehicleMake: { type: String, required: true },
    vehicleModel: { type: String, required: true },

    customerDetails: { type: mongoose.Schema.Types.ObjectId, ref: 'UserDetailsAccounts' },
    
});

const Applicants = mongoose.model('applicant', applicantSchema);


const generateForm16ASchema = new mongoose.Schema({
  pan: {
    type: String,
    required: true,
    match: /^([A-Z]){5}([0-9]){4}([A-Z]){1}$/ 
  },
  assessmentYear: {
    type: Number,
    required: true,
    min: 2000,
    max: 9999
  },
  quarter: {
    type: String,
    required: true,
    enum: ['Q1', 'Q2', 'Q3', 'Q4'] 
  }
});


const Form16ARequest = mongoose.model('Form16ARequest', generateForm16ASchema);


const otherbankpayeeSchema = new mongoose.Schema({
  payeeAccountNumber: {
    type: String,
    required: true
  },
  payeeNickname: {
    type: String,
    required: true
  },
  accountType: {
    type: String,
    enum: ['Savings', 'Current'],
    required: true
  },
  payeeBankIFSCCode: {
    type: String,
    required: true
  },
  accountNumber: {
    type: String,
    required: true
  },
  confirmPayeeAccountNumber: {
    type: String,
    required: true
  },
  registrationAlertMobileNumber: {
    type: String,
    required: true
  }
});

const otherbankpayee = mongoose.model('otherbankpayee', otherbankpayeeSchema);



module.exports = {Applicants,QuickFundTransferModel,generateForm16ASchema,otherbankpayee};