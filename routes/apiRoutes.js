const express = require("express");
const router = express.Router();
const PDFDocument = require("pdfkit");
const fs = require("fs");
const AWS = require("aws-sdk")
 const {UserDetailsAccounts} = require('../models/userAccountDetails');
 const {generateForm16ASchema} = require('../models/userAccountDetails');



router.post("/generateCertificate", async (request, response) => {
  try {
    const {
      accountNumber,
      bankBranchName,
      accountHolderName,
      accountHolderAddress,
      userAccountType,
      interestPeriod,
      startDate,
      endDate,
      
    } = request.body;

   

    const newCertificate = new InterestCertificate({
      accountNumber,
      accountHolderName,
      accountHolderAddress,
      bankBranchName,
      userAccountType,
      interestPeriod,
      startDate,
      endDate,
      
    });
   
  
    let interestPaid = 0;
    let taxWithheld = 0;

    if (interestPeriod === "Monthly") {
      interestPaid = calculateMonthlyInterest(startDate, endDate);
      taxWithheld = calculateMonthlyTax(interestPaid);
    } else if (interestPeriod === "FinancialYear") {
      interestPaid = calculateFinancialYearInterest(startDate, endDate);
      taxWithheld = calculateFinancialYearTax(interestPaid);
    }

    newCertificate.interestPaid = interestPaid;
    newCertificate.taxWithheld = taxWithheld;

    await newCertificate.save();

    const buffers = [];
    doc.on("data", (buffer) => buffers.push(buffer));
    doc.on("end", () => {
      const pdfBuffer = Buffer.concat(buffers);

      response.setHeader("Content-Type", "application/pdf");
      response.setHeader(
        "Content-Disposition",
        'attachment; filename="interest_certificate.pdf"'
      );

      response.status(200).end(pdfBuffer);
    });

    doc.end();

    console.log(`PDF generated successfully for Account ${accountNumber}`);
  } catch (error) {
    console.error("Error generating certificate:", error);
    response
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});


function calculateMonthlyInterest(startDate, endDate) {
  
  return 100; 
}

function calculateMonthlyTax(interestPaid) {
  
  return interestPaid * 0.1; 
}

function calculateFinancialYearInterest(startDate, endDate) {
 
  return 500; 
}

function calculateFinancialYearTax(interestPaid) {
  
  return interestPaid * 0.1; 
}


 


router.post('/generatePDF', async (req, res) => {
    try {
        const { financialYear, quarter } = req.body;
        const solutionsSubmitted = 100;
        const ratePerSolution = 10;
        const payPercentage = 0.8;
        const grossEarningPreBonus = solutionsSubmitted * ratePerSolution;
        const grossBonus = grossEarningPreBonus * 0.2;
        const grossEarnings = grossEarningPreBonus + grossBonus;
        const tdsDeduction = grossEarnings * 0.1;
        const netEarnings = grossEarnings - tdsDeduction;

        const doc = new PDFDocument();

      
        const stream = fs.createWriteStream('Form16A.pdf');
        doc.pipe(stream);

        doc.fontSize(12);
        doc.text('Financial Year: ' + financialYear);
        doc.text('Quarter: ' + quarter);
        doc.moveDown();
        doc.table({
            headers: ['Description', 'Amount'],
            rows: [
                ['No.of Solutions Submitted', solutionsSubmitted],
                ['Rate Per Solution', ratePerSolution],
                ['Pay%', payPercentage],
                ['Gross Earning Prebonus', grossEarningPreBonus],
                ['Gross Bonus', grossBonus],
                ['Gross Earnings', grossEarnings],
                ['TDS Deduction', tdsDeduction],
                ['Net Earnings', netEarnings]
            ],
           
            x: 50,
            y: doc.y
        });

       
        doc.end();

       
        stream.on('finish', () => {
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=Form16A.pdf');
            fs.createReadStream('Form16A.pdf').pipe(res);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});










const inwardController = require('../controllers/inwardController');
const paymentTransactionController = require('../controllers/paymentController');
const transferTransactionController = require('../controllers/transferController');


router.post('/payment-Type', paymentTransactionController.createPaymentTransaction);
router.get('/payment-Type', paymentTransactionController.getPaymentTransactions);

router.post('/transfer-Type', transferTransactionController.createTransferTransaction);
router.get('/transfer-Type', transferTransactionController.getTransferTransactions);



 
// router.post('/send-OneTP', sendOTP);
// router.post('/verify-OneTP', verifyOTP);

// scheduled ends

 router.use(express.json());
// 

router.get("/",(req,res)=>{
    res.send("royal islamic bank server api routes")
})

const {Applicants,QuickFundTransferModel} =require('../models/applicant');
const sendOTP = require('../utils/sendOtp');


const nodemailer = require('nodemailer');


const UserDetailsFixeddeposit = require('../models/fixeddepositDetails')




const {PayLaterAccount} = require('../models/userAccountDetails');






const bcrypt = require('bcrypt');







router.get("/", (req, res) => {
    res.send("royal islamic bank server api routes");


});

router.post('/purchase', async (request, response) => {
    try {

        const {
            vehicleRegNum, vehicleMake, vehicleModel,
            customerName, mobileNumber, emailId, address, pincode, city, state
        } = request.body;

        const isAccountNumExists = await UserDetailsAccounts.findOne({userAccountNumber: userAccountNumber});
        if(!isAccountNumExists){

        const userAccountNumber = parseInt(request.body.userAccountNumber);
        if (/pattern/.test(userAccountNumber)) {
            return response.status(400).json({ error: 'User account number must be 9 digits' });
        }

        let userDetails = await UserDetailsAccounts.findOne({ userAccountNumber });

        if (!userDetails) {
            
            userDetails = new UserDetailsAccounts({
                userAccountNumber,
                // Add other user details here
            });
            await userDetails.save();
        }

        // Store the vehicle registration details
        const newApplicant = new Applicants({
            vehicleRegNum,
            vehicleMake,
            vehicleModel,
            customerDetails: userDetails._id,
        });

        await newApplicant.save();

        // Assuming success, send success response
        return response.status(200).json({ message: 'Purchase details stored successfully' });
    } 
  }catch (error) {
        console.error(error.message, 'purchase-error');
        return response.status(500).json({ error: 'Internal Server Error' });
    }
  
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



router.post('/fdformdetails', async (request, response)=> {
    try {
        const {
            FixeddepositAccountNumber, FixeddepositTitle, FixeddepositFirstname, FixeddepositMiddlename, FixeddepositSurname, FixeddepositDateOfBirth,
            FixeddepositMobileNumber, FixeddepositEmailId, FixeddepositLine1, FixeddepositLine2, FixeddepositTown, FixeddepositCountry, FixeddepositPostcode, FixeddepositAmount, FixeddepositTermyears,
            FixeddepositTermmonths, FixeddepositTermdays, FixeddepositInterestrate, FixeddepositInterestpay, FixeddepositBankname, NomineeTitle, NomineeFirstname, NomineeMiddlename, NomineeSurname, NomineeDateOfBirth, NomineeMobileNumber,
            NomineeEmailId, NomineeLine1, NomineeLine2, NomineeTown, NomineeCountry, NomineePostcode
        } = request.body;

        const isAccountNumExists = await UserDetailsFixeddeposit.findOne({ FixeddepositAccountNumber: FixeddepositAccountNumber });
        if (!isAccountNumExists) {
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
                NomineeTitle: NomineeTitle,
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
                NomineePostcode: NomineePostcode,
            });
            newAccountCreation.save();
            
            // Send email notification
            const email = FixeddepositEmailId;
            await sendEmailNotification(email);
            
            return response.status(200).json({ message: 'FD created successfully' });
        } else {
            return response.status(400).json({ message: 'FD is already exists in bank' });
        }
    } catch (error) {
        console.log(error.message, 'account-creation');
        return response.status(500).json({ message: 'Internal Server Error at User FD Creation' });
    }

    async function sendEmailNotification(email) {
        try {
            // Create a nodemailer transporter
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'royalislamicbank@gmail.com', // replace with your email
                    pass: 'yqlo ffyv qsic jrqs' // replace with your email password
                }
            });
    
            // Setup email data
            const mailOptions = {
                from: 'royalislamicbank@gmail.com',
                to: email,
                subject: 'Fixed Deposit Created',
                text: 'Your fixed deposit has been created successfully.'
            };
    
            // Send the email
            await transporter.sendMail(mailOptions);
    
            console.log('Email notification sent successfully');
        } catch (error) {
            console.error('Error sending email notification:', error.message);
        }
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
            const email = RecurringdepositEmailId;
            await sendEmailNotification(email);
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
    async function sendEmailNotification(email) {
        try {
            // Create a nodemailer transporter
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'royalislamicbank@gmail.com', // replace with your email
                    pass: 'yqlo ffyv qsic jrqs' // replace with your email password
                }
            });
    
            // Setup email data
            const mailOptions = {
                from: 'royalislamicbank@gmail.com',
                to: email,
                subject: 'Recurring Deposit Created',
                text: 'Your Recurring deposit has been created successfully.'
            };
    
            // Send the email
            await transporter.sendMail(mailOptions);
    
            console.log('Email notification sent successfully');
        } catch (error) {
            console.error('Error sending email notification:', error.message);
        }
    }
});


router.get('/userDetails/:accountNumber', async (request, response)=> {
    try {
        const accountNumber = request.params.accountNumber;
        const userDetails = await UserDetailsAccounts.findOne({userAccountNumber: accountNumber});
        
        if (userDetails) {
            return response.status(200).json({ details: userDetails,}); 
        } 
        else if (selectedUser && selectedUser.accountHolderPAN !== accountHolderPAN) {
          return response.status(400).json({ message: 'PAN number does not match with the account holder'});   
        }
       
        else {
            return response.status(404).json({ message: 'User not found with the provided account number' });
        }

    } 
    catch (error) {
        console.log(error.message, 'account details');
        return response.status(500).json({message: 'Internal Server'});

        
    }
})

 
router.post('/submitForm', inwardController.submitForm);



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
        // return response.status(500).json({ error: 'Internal Server Error at Vehicle Registration' });
        return res.status(500).json(`{ error: Internal Server Error at Vehicle Registration: ${error.message} }`);

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

