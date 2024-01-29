const express = require("express");
const router = express.Router();

const UserDetailsAccounts = require('../models/userAccountDetails');
const Applicants = require('../models/applicant');

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

router.post('/vehicleRegistration', async (request, response) => {
    try {
        const {
            vehicleRegNum, vehicleMake, vehicleModel, userAccountNumber,
        } = request.body;

        
        const userDetails = await UserDetailsAccounts.findOne({ userAccountNumber });

        if (!userDetails) {
            
            return response.status(404).json({ error: 'User not found with the provided account number' });
        }

  
        const newApplicant = new Applicants({
            vehicleRegNum,
            vehicleMake,
            vehicleModel,
            customerDetails: userDetails._id,
        });

        newApplicant.save();

        return response.status(200).json({ message: 'Vehicle registered successfully' });
    } catch (error) {
        console.error(error.message, 'vehicle-registration');
        return response.status(500).json({ error: 'Internal Server Error at Vehicle Registration' });
    }
});

router.post('/fastagRecharge', async (request, response) => {
    try {
        const { userAccountNumber, rechargeAmount } = request.body;

        
        const userDetails = await UserDetailsAccounts.findOne({ userAccountNumber });

        if (!userDetails) {
         
            return response.status(404).json({ error: 'User not found with the provided account number' });
        }


        return response.status(200).json({ message: 'Fastag recharge successful' });
    } catch (error) {
        console.error(error.message, 'fastag-recharge');
        return response.status(500).json({ error: 'Internal Server Error at Fastag Recharge' });
    }
});

module.exports = router;
