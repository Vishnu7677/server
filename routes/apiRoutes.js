const express = require("express");
const router = express.Router();

const UserDetailsAccounts = require('../models/userAccountDetails');
const UserDetailsFixeddeposit = require('../models/fixeddepositDetails')

router.get("/",(req,res)=>{
    res.send("royal islamic bank server api routes")
});

router.post('/accountCreation', async (request, response)=> {
    try {
        const { 
            userAccountNumber, accountHolderName, bankBranchName, userAccountType, userDateOfBirth, userEmailId,
            userMobileNumber, accountHolderPAN, bankBranchIfscCode, accountHolderAddress, userAccountBalance
        } = request.body;

        const isAccountNumExists = await UserDetailsAccounts.findOne({userAccountNumber: userAccountNumber});
        if(!isAccountNumExists){
            const newAccountCreation = new UserDetailsAccounts({
                userAccountNumber: userAccountNumber,
                accountHolderName: accountHolderName,
                bankBranchName: bankBranchName,
                userAccountType: userAccountType,
                userDateOfBirth: userDateOfBirth,
                userEmailId: userEmailId,
                userMobileNumber: userMobileNumber,
                accountHolderPAN: accountHolderPAN,
                bankBranchIfscCode: bankBranchIfscCode,
                accountHolderAddress: accountHolderAddress,
                userAccountBalance: userAccountBalance
            });
            newAccountCreation.save();
            return response.status(200).json({message: 'Account created successfully'})
        }
        else{
            return response.status(400).json({message: 'Account is already exists in bank'})
        }
    } 
    catch (error) {
        console.log(error.message, 'account-creation');
        return response.status(500).json({message: 'Internal Server Error at User Account Creation'});
    }
});

router.get('/userDetails/:accountNumber', async (request, response)=> {
    try {
        const accountNumber = request.params.accountNumber;
        const userDetails = await UserDetailsAccounts.findOne({userAccountNumber: accountNumber});
        if (userDetails) {
            return response.status(200).json({ details: userDetails });
        } 
        else {
            return response.status(404).json({ message: 'User not found with the provided account number' });
        }
    } 
    catch (error) {
        console.log(error.message, 'account details');
        return response.status(500).json({message: 'Internal Server'})
    }
})

router.post('/fdformdetails', async (request, response)=> {
    try {
        const { 
            FixeddepositAccountNumber, FixeddepositTitle, FixeddepositFirstname, FixeddepositMiddlename, FixeddepositSurname, FixeddepositDateOfBirth,
            FixeddepositMobileNumber, FixeddepositEmailId, FixeddepositLine1, FixeddepositLine2, FixeddepositTown,FixeddepositCountry,FixeddepositPostcode,FixeddepositAmount,FixeddepositTermyears
            ,FixeddepositTermmonths,FixeddepositTermdays,FixeddepositInterestrate,FixeddepositInterestpay,FixeddepositBankname,NomineeTitle,NomineeFirstname,NomineeMiddlename,NomineeSurname,NomineeDateOfBirth,NomineeMobileNumber
            ,NomineeEmailId,NomineeLine1,NomineeLine2,NomineeTown,NomineeCountry,NomineePostcode
        } = request.body;

        const isAccountNumExists = await UserDetailsFixeddeposit.findOne({FixeddepositAccountNumber: FixeddepositAccountNumber});
        if(!isAccountNumExists){
            const newAccountCreation = new UserDetailsFixeddeposit({
                FixeddepositAccountNumber: FixeddepositAccountNumber,
                FixeddepositTitle: FixeddepositTitle,
                FixeddepositFirstname: FixeddepositFirstname,
                FixeddepositMiddlename: FixeddepositMiddlename,
                FixeddepositSurname: FixeddepositSurname,
                FixeddepositDateOfBirth: FixeddepositDateOfBirth,
                FixeddepositMobileNumber: FixeddepositMobileNumber,
                FixeddepositEmailId: FixeddepositEmailId,
                FixeddepositLine1: FixeddepositLine1,
                FixeddepositLine2: FixeddepositLine2,
                FixeddepositTown: FixeddepositTown,
                FixeddepositCountry: FixeddepositCountry,
                FixeddepositPostcode: FixeddepositPostcode,
                FixeddepositAmount: FixeddepositAmount,
                FixeddepositTermyears: FixeddepositTermyears,
                FixeddepositTermmonths: FixeddepositTermmonths,
                FixeddepositTermdays: FixeddepositTermdays,
                FixeddepositInterestrate: FixeddepositInterestrate,
                FixeddepositInterestpay: FixeddepositInterestpay,
                FixeddepositBankname: FixeddepositBankname,
                NomineeTitle:NomineeTitle,
                NomineeFirstname: NomineeFirstname,
                NomineeMiddlename: NomineeMiddlename,
                NomineeSurname: NomineeSurname,
                NomineeDateOfBirth: NomineeDateOfBirth,
                NomineeMobileNumber: NomineeMobileNumber,
                NomineeEmailId: NomineeEmailId,
                NomineeLine1: NomineeLine1,
                NomineeLine2: NomineeLine2,
                NomineeTown: NomineeTown,
                NomineeCountry: NomineeCountry,
                NomineePostcode:NomineePostcode,
            });
            newAccountCreation.save();
            return response.status(200).json({message: 'FD created successfully'})
        }
        else{
            return response.status(400).json({message: 'FD is already exists in bank'})
        }
    } 
    catch (error) {
        console.log(error.message, 'account-creation');
        return response.status(500).json({message: 'Internal Server Error at User FD Creation'});
    }
});


router.post('/rdformdetails', async (request, response)=> {
    try {
        const { 
            RecurringdepositAccountNumber, RecurringdepositTitle, RecurringdepositFirstname, RecurringdepositMiddlename, RecurringdepositSurname, RecurringdepositDateOfBirth,
            RecurringdepositMobileNumber, RecurringdepositEmailId, RecurringdepositLine1, RecurringdepositLine2, RecurringdepositTown,RecurringdepositCountry,RecurringdepositPostcode,RecurringdepositAmount,RecurringdepositTermyears
            ,RecurringdepositTermmonths,RecurringdepositTermdays,RecurringdepositInterestrate,RecurringdepositInterestpay,RecurringdepositBankname,RecurringNomineeTitle,RecurringNomineeFirstname,RecurringNomineeMiddlename,RecurringNomineeSurname,RecurringNomineeDateOfBirth,RecurringNomineeMobileNumber
            ,RecurringNomineeEmailId,RecurringNomineeLine1,RecurringNomineeLine2,RecurringNomineeTown,RecurringNomineeCountry,RecurringNomineePostcode
        } = request.body;

        const isAccountNumExists = await UserDetailsFixeddeposit.findOne({RecurringdepositAccountNumber: RecurringdepositAccountNumber});
        if(!isAccountNumExists){
            const newAccountCreation = new UserDetailsFixeddeposit({
                RecurringdepositAccountNumber: RecurringdepositAccountNumber,
                RecurringdepositTitle: RecurringdepositTitle,
                RecurringdepositFirstname: RecurringdepositFirstname,
                RecurringdepositMiddlename: RecurringdepositMiddlename,
                RecurringdepositSurname: RecurringdepositSurname,
                RecurringdepositDateOfBirth: RecurringdepositDateOfBirth,
                RecurringdepositMobileNumber: RecurringdepositMobileNumber,
                RecurringdepositEmailId: RecurringdepositEmailId,
                RecurringdepositLine1: RecurringdepositLine1,
                RecurringdepositLine2: RecurringdepositLine2,
                RecurringdepositTown: RecurringdepositTown,
                RecurringdepositCountry: RecurringdepositCountry,
                RecurringdepositPostcode: RecurringdepositPostcode,
                RecurringdepositAmount: RecurringdepositAmount,
                RecurringdepositTermyears: RecurringdepositTermyears,
                RecurringdepositTermmonths: RecurringdepositTermmonths,
                RecurringdepositTermdays: RecurringdepositTermdays,
                RecurringdepositInterestrate: RecurringdepositInterestrate,
                RecurringdepositInterestpay: RecurringdepositInterestpay,
                RecurringdepositBankname: RecurringdepositBankname,
                RecurringNomineeTitle:RecurringNomineeTitle,
                RecurringNomineeFirstname: RecurringNomineeFirstname,
                RecurringNomineeMiddlename: RecurringNomineeMiddlename,
                RecurringNomineeSurname: RecurringNomineeSurname,
                RecurringNomineeDateOfBirth: RecurringNomineeDateOfBirth,
                RecurringNomineeMobileNumber: RecurringNomineeMobileNumber,
                RecurringNomineeEmailId: RecurringNomineeEmailId,
                RecurringNomineeLine1: RecurringNomineeLine1,
                RecurringNomineeLine2: RecurringNomineeLine2,
                RecurringNomineeTown: RecurringNomineeTown,
                RecurringNomineeCountry: RecurringNomineeCountry,
                RecurringNomineePostcode:RecurringNomineePostcode,
                
            });
            newAccountCreation.save();
            return response.status(200).json({message: 'RD created successfully'})
        }
        else{
            return response.status(400).json({message: 'RD is already exists in bank'})
        }
    } 
    catch (error) {
        console.log(error.message, 'account-creation');
        return response.status(500).json({message: 'Internal Server Error at User RD Creation'});
    }
});

module.exports = router;