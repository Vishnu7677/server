const express = require("express");
const router = express.Router();
const UserDetailsAccounts = require('../models/userAccountDetails');
const sendOTP = require('../utils/sendOtp'); // Create a function to send OTP, you can use an external library for this
const bcrypt = require('bcrypt');


router.get("/", (req, res) => {
    res.send("royal islamic bank server api routes");
});

router.post('/accountCreation', async (request, response) => {
    try {
        const {
            userAccountNumber, accountHolderName, bankBranchName, userAccountType, userDateOfBirth, userEmailId,
            userMobileNumber, accountHolderPAN, bankBranchIfscCode, accountHolderAddress, userAccountBalance, userDebitCardDetails,

        } = request.body;

        const isAccountNumExists = await UserDetailsAccounts.findOne({ userAccountNumber: userAccountNumber });

        if (!isAccountNumExists) {
            // Hash the debit card PIN before saving
            const hashedDebitCardPin = await bcrypt.hash(userDebitCardDetails.userDebitCardPin.userDebitcardpin.toString(), 10);
            const hashedConfirmDebitCardPin = await bcrypt.hash(userDebitCardDetails.userDebitCardPin.confirmuserDebitcardpin.toString(), 10);

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
                userAccountBalance: userAccountBalance,
                userDebitCardDetails: {
                    userDebitCardNumber: userDebitCardDetails.userDebitCardNumber,
                    userDebiitCardExpiryDate: userDebitCardDetails.userDebiitCardExpiryDate,
                    userDebitCardcvv: userDebitCardDetails.userDebitCardcvv,
                    userDebitCardPin: {
                        userDebitcardpin: hashedDebitCardPin,
                        confirmuserDebitcardpin: hashedConfirmDebitCardPin,
                    }
                },
            });

            newAccountCreation.save();
            return response.status(200).json({ message: 'Account created successfully' });
        } else {
            return response.status(400).json({ message: 'Account is already exists in the bank' });
        }
    } catch (error) {
        console.log(error.message, 'account-creation');
        return response.status(500).json({ message: 'Internal Server Error at User Account Creation' });
    }
});


router.get('/userDetails/:accountNumber', async (request, response) => {
    try {
        const accountNumber = request.params.accountNumber;
        const userDetails = await UserDetailsAccounts.findOne({ userAccountNumber: accountNumber });
        if (userDetails) {
            return response.status(200).json({ details: userDetails });
        }
        else {
            return response.status(404).json({ message: 'User not found with the provided account number' });
        }
    }
    catch (error) {
        console.log(error.message, 'account details');
        return response.status(500).json({ message: 'Internal Server' })
    }
})



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


// updating domestic limits
router.put('/updateDomesticLimits/:accountNumber', async (request, response) => {
    try {
        const accountNumber = request.params.accountNumber;
        const { newDomesticLimits } = request.body;
  
        const updatedUserDetails = await UserDetailsAccounts.findOneAndUpdate(
          { userAccountNumber: accountNumber },
          { $set: { 'userDebitCardDetails.domesticLimits': newDomesticLimits } },
          { new: true }
        );
  
        if (updatedUserDetails) {
            return response.status(200).json({ message: 'Domestic limits updated successfully' });
        } else {
            return response.status(404).json({ message: 'User not found with the provided account number' });
        }
    } catch (error) {
        console.log(error.message, 'update domestic limits');
        return response.status(500).json({ message: 'Internal Server Error' });
    }
  });


// updating international limits
router.put('/updateInternationalLimits/:accountNumber', async (request, response) => {
    try {
      const accountNumber = request.params.accountNumber;
      const { newInternationalLimits } = request.body;
  
      const updatedUserDetails = await UserDetailsAccounts.findOneAndUpdate(
        { userAccountNumber: accountNumber },
        { $set: { 'userDebitCardDetails.internationalLimits': newInternationalLimits } },
        { new: true }
      );
  
      if (updatedUserDetails) {
        return response.status(200).json({ message: 'International limits updated successfully' });
      } else {
        return response.status(404).json({ message: 'User not found with the provided account number' });
      }
    } catch (error) {
      console.log(error.message, 'update international limits');
      return response.status(500).json({ message: 'Internal Server Error' });
    }
  });



module.exports = router;
