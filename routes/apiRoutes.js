const express = require("express");
const router = express.Router();

const {UserDetailsAccounts} = require('../models/userAccountDetails');


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
        return response.status(500).json({message: 'Internal Server Error at Account Details API'})
    }
});

router.post('/otp-send', async (req,res)=> {
    try {
      
        let otpcode = Math.floor(100000 + Math.random() * 900000);
      
        const responseType = {};
    
        let existingOtp = await UserDetailsAccounts.findOne({ userEmailId: req.body.email });
      
        if (existingOtp) {
            existingOtp.otpCode = otpcode;
            await existingOtp.save();
        } 
        else {
            // Create new OTP
            let otpData = new UserDetailsAccounts({
                userEmailId: req.body.email,
                code: otpcode,
            });
            await otpData.save();
        }
      
        responseType.statusText = "Success";
        responseType.message = "Please check your Email Id";
      
          // Send email
        var nodemailer = require('nodemailer');
        var transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            service: 'gmail',
            port: 465,
            secure: true,
            auth: {
              user: "giribabu8719@gmail.com",
              pass: 'dvfe ptfi maek rneh'
            }
        });
      
        let otpInfo = await UserDetailsAccounts.findOne({ userEmailId: req.body.email });
        let mailOptions = {
            from: 'giribabu8719@gmail.com',
            to: req.body.email,
            subject: 'Royal Islamic Bank User Authentication',
            html:
             `  <div>
                    <p>Dear Customer,</p>
                    <p>
                        Your OTP is ${otpcode}. Do not share it with anyone by any means. This is confidential and to be used by you only.
                    </p>
                    <div>Warm regards,</div>
                    <div>Royal Islamic Bank (RIB)</div>
                </div>
            `
        };
      
            let info = await transporter.sendMail(mailOptions);
      
            res.status(200).json(responseType);
        } 
        catch (error) {
          console.error(error);
          res.status(500).json({
            statusText: "error",
            message: "Internal Server Error",
          });
        }
});

router.post('/verify-otp', async (request, response)=> {
    try {
        const email = request.body.email;
        const { gmailOTP } = request.body;
        
        const isMailExists = await UserDetailsAccounts.findOne({userEmailId: email})
        if(isMailExists)
        {
            if(isMailExists.otpCode === gmailOTP){
                return response.status(200).json({ message: 'OTP verification successful' });
            }
            else {
                return response.status(400).json({ message: 'Invalid OTP' });
            }
        }
        else{
            return response.status(400).json({message: 'Email not found'})
        }
    } 
    catch (error) {
        console.log(error.message, 'otp verification');
        return response.status(500).json({message: 'Internal server error at OTP Verification'})
    }
});


module.exports = router;