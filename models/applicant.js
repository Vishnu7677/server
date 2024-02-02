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
    
})

const Applicants = mongoose.model('applicant', applicantSchema);

module.exports = {Applicants,QuickFundTransferModel};