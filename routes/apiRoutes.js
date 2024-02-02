const express = require("express");
const router = express.Router();


const {UserDetailsAccounts,PayLaterAccount} = require('../models/userAccountDetails');





const sendOTP = require('../utils/sendOtp');
const bcrypt = require('bcrypt');



const {UserDetailsAccounts} = require('../models/userAccountDetails');



router.get("/", (req, res) => {
    res.send("royal islamic bank server api routes");
});


router.post('/accountCreation', async (request, response) => {
    try {
        const {
            userAccountNumber, accountHolderName, bankBranchName, userAccountType, userDateOfBirth, userEmailId,

            userMobileNumber, accountHolderPAN, bankBranchIfscCode, accountHolderAddress, userAccountBalance, userDebitCardDetails

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
                }

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
                    <p>Dear ${existingOtp.accountHolderName},</p>
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


// Route for generating debit card PIN
router.post('/generate-Debit-Card-Pin', async (req, res) => {
    try {
      const { userAccountNumber, debitCardPin, confirmDebitCardPin } = req.body;
  
      if (debitCardPin !== confirmDebitCardPin) {
        return res.status(400).json({ error: 'PINs do not match' });
      }
  
      const user = await UserDetailsAccounts.findOne({ userAccountNumber });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (!user.userDebitCardDetails) {
        user.userDebitCardDetails = {};
      }
  
      if (!user.userDebitCardDetails.userDebitCardPin) {
        user.userDebitCardDetails.userDebitCardPin = {};
      }

      user.userDebitCardDetails.userDebitCardPin.userDebitcardpin = debitCardPin;
      user.userDebitCardDetails.userDebitCardPin.confirmuserDebitcardpin = confirmDebitCardPin;
  
      await user.save();
  
      return res.json({ success: true, message: 'Debit card PIN generated successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  



router.put('/blockCard/:userAccountNumber', async (req, res) => {
    try {
      const { userAccountNumber } = req.params;

      const user = await UserDetailsAccounts.findOne({ userAccountNumber });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      user.userDebitCardDetails.userDebitCardStatus = 'blocked';
  
      await user.save();
  
      res.json({ message: 'Card blocked successfully' });
    } catch (error) {
      console.error('Error blocking card:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  router.put('/update-address/:accountNumber', async (req, res) => {
    try {
        const { accountNumber } = req.params;
        const { communicationAddress, pincode, state, city, village } = req.body;

        const user = await UserDetailsAccounts.findOne({ userAccountNumber: accountNumber });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.accountHolderAddress) {
            user.accountHolderAddress = {};
        }
        user.accountHolderAddress.communicationAddress = communicationAddress;
        user.accountHolderAddress.pincode = pincode;
        user.accountHolderAddress.state = state;
        user.accountHolderAddress.city = city;
        user.accountHolderAddress.village = village;

        await user.save();

        res.json({ message: 'Address updated successfully' });
    } catch (error) {
        console.error('Error updating address:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.post('/createReissueCard', async (req, res) => {
    try {
        const { userAccountNumber } = req.body;
        const srn = generateUniqueSRN();
        const userDetails = await UserDetailsAccounts.findOne({ userAccountNumber });

        if (!userDetails) {
            return res.status(404).json({ error: 'User not found' });
        }
        userDetails.userDebitCardDetails.reissueCard = { srn };
        await userDetails.save();

        res.json({ srn });
    } catch (error) {
        console.error('Error creating reissue card request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

function generateUniqueSRN() {
    return `SRN-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}





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





const addPayLater=async()=>{
    try {
        const payLater = new PayLaterAccount({
            accountNumber: '50100444336091',
            accountType: 'paylater',
            totalCreditLimit: '50000.00',
            utilisedLimit: '-10000.00',
            availableLimit: '40000.00',
            amountDue: '10000.00',
            dueDate: '15-02-24',
            lateFee: '0',
            totalAdjustAmount: '0',
            totalAmountPayable: '10000.00',
            billPeriod: '01-01-24 to 25-01-24',
        });
    
     await payLater.save();
     mongoose.disconnect()
    
      } catch (e) {
        console.log(e);
      }

}

// addPayLater();

router.get('/payLaterAccount',async(req,res)=>{
    try{
        const payLaterData = await PayLaterAccount.find()
        return res.status(200).json({payLater:payLaterData})

    }catch(e){
        console.log(e,'paylaterapi')

        return res.status(500).json({message:'Internal Server Error'})
    }
})
router.put('/payLaterAccount/pay', async (req, res) => {
    const { accountNumber } = req.body;
  
    try {
      const payLaterAccount = await PayLaterAccount.findOne({ accountNumber });
  
      if (!payLaterAccount) {
        return res.status(404).json({ message: 'PayLater account not found' });
      }
      payLaterAccount.utilisedLimit = 0;
      payLaterAccount.availableLimit = payLaterAccount.totalCreditLimit;
      payLaterAccount.dueDate = '';
      await payLaterAccount.save();
  
      return res.status(200).json({ message: 'Payment successful', payLater: payLaterAccount });
    } catch (e) {
      console.log(e, 'payLaterAPI');
  
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  });


module.exports = router;

