const express = require("express");
const router = express.Router();
const inwardController = require('../controllers/inwardController');
const paymentTransactionController = require('../controllers/paymentController');
const transferTransactionController = require('../controllers/transferController');

router.post('/payment-Type', paymentTransactionController.createPaymentTransaction);
router.get('/payment-Type', paymentTransactionController.getPaymentTransactions);

router.post('/transfer-Type', transferTransactionController.createTransferTransaction);
router.get('/transfer-Type', transferTransactionController.getTransferTransactions);


//  sairam  inward remittancecode
const nodemailer = require('nodemailer');
const Applicants = require('../models/applicant');
 const UserAccount = require('../models/userAccountDetails');
  
const { sendOTP, verifyOTP } = require('../controllers/otpController');

 
router.post('/send-OneTP', sendOTP);
router.post('/verify-OneTP', verifyOTP);

// scheduled ends
//   
// 
const UserDetailsAccounts = require('../models/userAccountDetails');
 
//
 router.use(express.json());
// 
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

//  

 
router.post('/submitForm', inwardController.submitForm);
 
//   
module.exports = router;