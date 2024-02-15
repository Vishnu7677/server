
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





module.exports = {Applicants,QuickFundTransferModel, generateForm16ASchema};

