const mongoose = require('mongoose');

const userDetailsAccounts = new mongoose.Schema({
    userAccountNumber: {type: Number},
    accountHolderName: {type: String},
    bankBranchName: {type: String},
    userAccountType: {type: String},
    userDateOfBirth: {type: String},
    userEmailId: {type: String},
    userMobileNumber: {type: Number},
    accountHolderPAN: {type: String},
    bankBranchIfscCode : {type: String},
    accountHolderAddress: {type: String},
    userAccountBalance: {type: String}
});

const UserDetailsAccounts = mongoose.model('userDetailsAccounts', userDetailsAccounts);

// const interestCertificateSchema = new mongoose.Schema({
//   userAccountNumber: {type: Number},
//   interestPeriod: { type: String, enum: ['InterestPeriod', 'InterestPeriodDate'] },
//   startDate: { type: Date },
//   endDate: { type: Date },
//   interestPaid: { type: Number},  
//   taxWithheld: { type: Number}
 
// });

// const InterestCertificate = mongoose.model('InterestCertificate', interestCertificateSchema);, InterestCertificate



module.exports = UserDetailsAccounts;