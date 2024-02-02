const mongoose = require('mongoose');

const userDetailsFixeddeposit = new mongoose.Schema({
    FixeddepositAccountNumber: {type: Number},
    FixeddepositTitle: {type: String},
    FixeddepositFirstname: {type: String},
    FixeddepositMiddlename: {type: String},
    FixeddepositSurname: {type: String},
    FixeddepositDateOfBirth: {type: String},
    FixeddepositMobileNumber: {type: Number},
    FixeddepositEmailId: {type: String},
    FixeddepositLine1: {type: String},
    FixeddepositLine2 : {type: String},
    FixeddepositTown: {type: String},
    FixeddepositCountry: {type: String},
    FixeddepositPostcode: {type: String},
    FixeddepositAmount: {type: String},
    FixeddepositTermyears: {type: String},
    FixeddepositTermmonths: {type: String},
    FixeddepositTermdays: {type: String},
    FixeddepositInterestrate: {type: String},
    FixeddepositInterestpay: {type: String},
    FixeddepositBankname: {type: String},
    NomineeTitle: {type: String},
    NomineeFirstname: {type: String},
    NomineeMiddlename: {type: String},
    NomineeSurname: {type: String},
    NomineeDateOfBirth: {type: String},
    NomineeMobileNumber: {type: Number},
    NomineeEmailId: {type: String},
    NomineeLine1: {type: String},
    NomineeLine2 : {type: String},
    NomineeTown: {type: String},
    NomineeCountry: {type: String},
    NomineePostcode: {type: String},  
    
    // recurring deposit...........

    RecurringdepositAccountNumber: {type: Number},
    RecurringdepositTitle: {type: String},
    RecurringdepositFirstname: {type: String},
    RecurringdepositMiddlename: {type: String},
    RecurringdepositSurname: {type: String},
    RecurringdepositDateOfBirth: {type: String},
    RecurringdepositMobileNumber: {type: Number},
    RecurringdepositEmailId: {type: String},
    RecurringdepositLine1: {type: String},
    RecurringdepositLine2 : {type: String},
    RecurringdepositTown: {type: String},
    RecurringdepositCountry: {type: String},
    RecurringdepositPostcode: {type: String},
    RecurringdepositAmount: {type: String},
    RecurringdepositTermyears: {type: String},
    RecurringdepositTermmonths: {type: String},
    RecurringdepositTermdays: {type: String},
    RecurringdepositInterestrate: {type: String},
    RecurringdepositInterestpay: {type: String},
    RecurringdepositBankname: {type: String},
    RecurringNomineeTitle: {type: String},
    RecurringNomineeFirstname: {type: String},
    RecurringNomineeMiddlename: {type: String},
    RecurringNomineeSurname: {type: String},
    RecurringNomineeDateOfBirth: {type: String},
    RecurringNomineeMobileNumber: {type: Number},
    RecurringNomineeEmailId: {type: String},
    RecurringNomineeLine1: {type: String},
    RecurringNomineeLine2 : {type: String},
    RecurringNomineeTown: {type: String},
    RecurringNomineeCountry: {type: String},
    RecurringNomineePostcode: {type: String}, 


    
        
    

    
});

const UserDetailsFixeddeposit = mongoose.model('userDetailsFixeddeposit', userDetailsFixeddeposit);

module.exports = UserDetailsFixeddeposit;