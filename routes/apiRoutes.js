const express = require("express");
const router = express.Router();
const {Applicants,QuickFundTransferModel} =require('../models/applicant');
const sendOTP = require('../utils/sendOtp');
const UserDetailsAccounts = require('../models/userAccountDetails');


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
});

router.post('/quickFundTransfer', async (req, res) => {
    try {
        const quickFundTransferData = req.body;

    
        if (quickFundTransferData.transferType === 'royal') {
            
            const isToAccountRoyal = await UserDetailsAccounts.exists({
                userAccountNumber: quickFundTransferData.toAccountNumber,
            });

            if (!isToAccountRoyal) {
                return res.status(400).json({ error: 'To Account Number is not a Royal Bank account' });
            }
        } else {
            
            
    
            const isValidToAccount = true; 

            if (!isValidToAccount) {
                return res.status(400).json({ error: 'Invalid To Account Number for other banks' });
            }
        }

        
        const savedData = await QuickFundTransferModel.create(quickFundTransferData);
        return res.json(savedData);

    } catch (error) {
        console.error('Error in quickFundTransfer:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/accountStatement', async (request, response) => {
    try {
        const { userAccountNumber, transactions } = request.body;

        
        const userAccount = await UserDetailsAccounts.findOne({ userAccountNumber });

        if (userAccount) {
            
            userAccount.transactions.push(...transactions);

            
            await userAccount.save();

            return response.status(200).json({ message: 'Account statement added successfully' });
        } else {
            return response.status(404).json({ message: 'User account not found' });
        }
    } catch (error) {
        console.error(error.message, 'account-statement');
        return response.status(500).json({ message: 'Internal Server Error at Account Statement Addition' });
    }
});
const generateOTP = () => Math.floor(1000 + Math.random() * 9000);
router.post('/generate-otp', async (request, response) => {
    try {

        const { accountNumber, debitCardNumber, cvv, mobileNumber, otpMethod } = request.body;
        const userDetails = await UserDetailsAccounts.findOne({ userAccountNumber: accountNumber });
        console.log(userDetails,otpMethod)

        if (userDetails) {
            const generatedOTP = generateOTP();
            userDetails.otp = generatedOTP;
            await userDetails.save();
 
            sendOTP(otpMethod, userDetails.userMobileNumber, userDetails.userEmailId, generatedOTP);

            return response.status(200).json({ message: 'OTP sent successfully' });
        } else {
            return response.status(404).json({ message: 'User not found with the provided account number' });
        }
    } catch (error) {
        console.log(error.message, 'generate PIN and send OTP');
        return response.status(500).json({ message: 'Internal Server Error' });
    }
});

router.post('/validate-otp', async (req, res) => {
    try {
        const { accountNumber, otp } = req.body;

        const userDetails = await UserDetailsAccounts.findOne({ userAccountNumber: accountNumber });

        if (userDetails && Number(userDetails.otp) === Number(otp)) {
            userDetails.otp = null;
            await userDetails.save();
            return res.status(200).json({ message: 'OTP validated successfully' });
        } else {
            console.log('Invalid OTP');
            return res.status(400).json({ message: 'Invalid OTP' });
        }
    } catch (error) {
        console.error('Error validating OTP:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;