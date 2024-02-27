const express = require("express");
const router = express.Router();
const PDFDocument = require("pdfkit");
const fs = require("fs");
const AWS = require("aws-sdk");



 const {generateForm16ASchema} = require('../models/userAccountDetails');

 const FixedDeposites = require("../models/fixedDeposites");
 const LoanAccount = require("../models/loanaccounts");



const {UserDetailsAccounts} = require('../models/userAccountDetails');
const {Applicants,QuickFundTransferModel} =require('../models/applicant');
const sendOTP = require('../utils/sendOtp');
const nodemailer = require('nodemailer');
const {PayLaterAccount} = require('../models/userAccountDetails');
const bcrypt = require('bcrypt');
const inwardController = require('../controllers/inwardController');
const paymentTransactionController = require('../controllers/paymentController');
const transferTransactionController = require('../controllers/transferController');

const axios = require('axios');


const { sendEmail } = require("../emailServiecs");



//const axios = require('axios');

// aadhar
router.post('/validate-aadhaar', async (req, res) => {
    const { aadhaarNumber } = req.body;
  
    if (!aadhaarNumber) {
      return res.status(400).json({ error: 'Aadhaar number is required.' });
        //  return res.status(400).json({ error: 'Aadhaar number is required.' });
}
  
    const encodedParams = new URLSearchParams();
    encodedParams.set('txn_id', '17c6fa41-778f-49c1-a80a-cfaf7fae2fb8');
    encodedParams.set('consent', 'Y');
    encodedParams.set('uidnumber', aadhaarNumber);
    encodedParams.set('clientid', '222');
    encodedParams.set('method', 'uidvalidatev2');
  
    const options = {
      method: 'POST',
      url: 'https://verifyaadhaarnumber.p.rapidapi.com/Uidverifywebsvcv1/VerifyAadhaarNumber',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'X-RapidAPI-Key': '6e52bb948cmshe5fe0588768acfcp123e37jsna917927a11e6',
        'X-RapidAPI-Host': 'verifyaadhaarnumber.p.rapidapi.com'
      },
      data: encodedParams,
    };
  
    try {
      const response = await axios.request(options);
      return res.status(200).json(response.data);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
}
);
 
// Aadhar

// const {Applicants,QuickFundTransferModel} =require('../models/applicant');
// const sendOTP = require('../utils/sendOtp');
// const nodemailer = require('nodemailer');
// const {PayLaterAccount} = require('../models/userAccountDetails');
// const bcrypt = require('bcrypt');
// const inwardController = require('../controllers/inwardController');
// const paymentTransactionController = require('../controllers/paymentController');
// const transferTransactionController = require('../controllers/transferController');




router.get('/panValid/:panNumber', async (req, res) => {
    const {panNumber} = req.params

    const options = {
      method: 'GET',
      url: `https://pan-card-verification-at-lowest-price.p.rapidapi.com/verifyPan/${panNumber}`,
      headers: {
        'x-rapid-api': 'rapid-api-database',
        'X-RapidAPI-Key': '99dd840abdmshd183db508cdec97p19a7f3jsnac9961b49d13',
        'X-RapidAPI-Host': 'pan-card-verification-at-lowest-price.p.rapidapi.com'
      }
    };
    
    try {
        const response = await axios.request(options);
        return res.status(200).json({data:response.data})
    } catch (error) {
        console.error(error);
    }
});

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

        // Sample data - Replace this with actual calculation logic based on selected quarter
        const solutionsSubmitted = 100;
        const ratePerSolution = 10;
        const payPercentage = 0.8;
        const grossEarningPreBonus = solutionsSubmitted * ratePerSolution;
        const grossBonus = grossEarningPreBonus * 0.2;
        const grossEarnings = grossEarningPreBonus + grossBonus;
        const tdsDeduction = grossEarnings * 0.1;
        const netEarnings = grossEarnings - tdsDeduction;

        // Create a new PDF document
        const doc = new PDFDocument();

        // Pipe the PDF document to a writable stream
        const stream = fs.createWriteStream('Form16A.pdf');
        doc.pipe(stream);

        // Add content to the PDF
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
            // Position of the table
            x: 50,
            y: doc.y
        });

        // Finalize the PDF
        doc.end();

        // Send the PDF as a response
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















router.post('/payment-Type', paymentTransactionController.createPaymentTransaction);
router.get('/payment-Type', paymentTransactionController.getPaymentTransactions);

router.post('/transfer-Type', transferTransactionController.createTransferTransaction);
router.get('/transfer-Type', transferTransactionController.getTransferTransactions);







const { TaxverifyOTP, generatedOTP, resendOTP   } = require("../controllers/otpController");

  


router.post('/api/generated-otp ', generatedOTP);
router.post('/api/resend-otp ',  resendOTP);
// router.post('/send-OneTP', TaxsendOTP);
router.post('/api/verify-OneTP', TaxverifyOTP);


 


 

 router.use(express.json());







const UserDetailsFixeddeposit = require('../models/fixeddepositDetails');

// const {Applicants,QuickFundTransferModel} =require('../models/applicant');
// const sendOTP = require('../utils/sendOtp');


// const nodemailer = require('nodemailer');



//const nodemailer = require('nodemailer');


//const UserDetailsFixeddeposit = require('../models/fixeddepositDetails')






//const bcrypt = require('bcrypt');





router.get("/",(req,res)=>{
  res.send("royal islamic bank server api routes")
})


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
  
  async function generatePurchaseOrderNumber() {
    try {
      const latestPurchaseOrder = await UserDetailsAccounts.findOne().sort({ purchaseOrderNumber: -1 }).limit(1);
      const lastOrderNumber = latestPurchaseOrder ? latestPurchaseOrder.purchaseOrderNumber : 0;
      const newOrderNumber = lastOrderNumber + 1;
      return newOrderNumber;
    } catch (error) {
      console.error('Error during purchase order number generation:', error);
      throw error;
    }
  }



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
        const isMailExists = await UserDetailsAccounts.findOne({userEmailId: email});
        if(isMailExists)
        {
            if(isMailExists.otpCode === gmailOTP){
                return response.status(200).json({ message: 'OTP verification successful' });
            }
            else{
                return response.status(400).json({ message: 'Invalid OTP' });
            }
        }
        else{
            return response.status(400).json({message: 'Email not found'});
        }
    } 
    catch (error) {
        console.log(error.message, 'OTP Verification');
        return response.status(500).json({message: 'Internal server error at OTP Verification'})
    }
});




  router.post('/creditcarddetails', async (request, response) => {
    try {
        const { userAccountNumber, userCreditCardDetails} = request.body;
        const isUserExists = await UserDetailsAccounts.findOne({userAccountNumber: userAccountNumber});
        if(isUserExists){
            isUserExists.userCreditCardDetails.push(...userCreditCardDetails)
            await isUserExists.save();
            return response.status(200).json({message: 'Credit Card Details Added'})
        }
        else{
            return response.status(400).json({message: 'Account not found'})
        }
    } 
    catch (error) {
        console.log(error);
        return response.status(500).json({message: 'Internal Server Error at Credit card details'})
    }
});

router.get('/creditcarddetails/:accountNumber/:creditCardNum', async (request, response) => {
    try {
        const accountNumber = request.params.accountNumber;
        const creditCardNum = request.params.creditCardNum;
        const customerDetails = await UserDetailsAccounts.findOne({ userAccountNumber: accountNumber });
        if (customerDetails) {
            const individualCreditCard = customerDetails.userCreditCardDetails.find(card => card.creditCardNumber === creditCardNum);
            if (individualCreditCard) {
                return response.status(200).json(individualCreditCard);
            } else {
                return response.status(404).json({ message: 'Credit Card Not Found' });
            }
        } else {
            return response.status(404).json({ message: 'Customer Not Found' });
        }
    } catch (error) {
        console.log(error);
        return response.status(500).json({ catch: 'Internal Server Error at GET Credit-Card-Details' });
    }
});

router.post('/creditcardlimit-otp', async (req,res)=> {
    try {
      
        let otpcode = Math.floor(100000 + Math.random() * 900000);
        const email = req.body.email
      
        const responseType = {};
    
        let existingOtp = await UserDetailsAccounts.findOne({ userEmailId: email });
      
        if (existingOtp) {
            existingOtp.otpCode = otpcode;
            await existingOtp.save();
        } 
        else {
            // Create new OTP
            let otpData = new UserDetailsAccounts({
                userEmailId: email,
                otpCode: otpcode,
            });
            await otpData.save();
        }
      
        responseType.statusText = "Success";
        responseType.message = `OTP is sended to ${email}`;
      
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
      
        let otpInfo = await UserDetailsAccounts.findOne({ userEmailId: email });
        let mailOptions = {
            from: 'giribabu8719@gmail.com',
            to: email,
            subject: 'Royal Islamic Bank Credit Card Limit',
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
            message: "Internal Server Error at Credit Card Limit OTP",
          });
        }
});

router.put('/update-domesticcardusage', async (request, response) => {
    try {
        const { 
            accountNumber, creditCardNum, atmTransaction, atmTransactionStatus, onlineTranStatus, 
            onlineTransaction, merchantStatus, merchantTrans, payTransaction, payTransLimit, cardLimit
        } = request.body;
        
        const isCustomerExist = await UserDetailsAccounts.findOne({ userAccountNumber: accountNumber });
        
        if (isCustomerExist) {
            const isCardExist = isCustomerExist.userCreditCardDetails.find(card => card.creditCardNumber === creditCardNum);
           
            if (isCardExist) {
                
                const limitDifference = parseInt(cardLimit) - parseInt(isCardExist.creditCardLimit);
                
                isCardExist.creditCardLimit = cardLimit;
                isCardExist.availableCreditLimit = parseInt(isCardExist.availableCreditLimit) + limitDifference;
                isCardExist.atmTransactionLimit = atmTransaction;
                isCardExist.atmWithdrawlStatus = atmTransactionStatus;
                isCardExist.onlineTransactionStatus = onlineTranStatus;
                isCardExist.onlineTransactionLimit = onlineTransaction;
                isCardExist.merchantOutletStatus = merchantStatus;
                isCardExist.merchantOutletTransLimit = merchantTrans;
                isCardExist.tapAndPayStatus = payTransaction;
                isCardExist.tapAndPayTransLimit = payTransLimit;

                await isCustomerExist.save();
                
                return response.status(200).json({ message: "Domestic Credit Card Usage Updated" });
            } 
            else{
                return response.status(400).json({ message: "Credit Card Not Found" });
            }
        } 
        else{
            return response.status(400).json({ message: "Customer not found" });
        }
    } 
    catch(error){
        console.log('Error at updating Domestic Card Usage', error);
        return response.status(500).json({ error: "Internal server error at Domestic Card Usage" });
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
  




  router.post('/generate-Credit-Card-Pin', async (req, res) => {
    try {
        const { userAccountNumber, creditCardPin, confirmCreditCardPin } = req.body;

        if (creditCardPin !== confirmCreditCardPin) {
            return res.status(400).json({ error: 'PINs do not match' });
        }

        let user = await UserDetailsAccounts.findOne({ userAccountNumber });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Find the credit card details for the user (assuming there's only one credit card)
        let creditCardDetails = user.userCreditCardDetails[0];

        if (!creditCardDetails) {
            return res.status(404).json({ error: 'Credit card details not found' });
        }

        // Hash the credit card PIN
        const hashedCreditCardPin = await bcrypt.hash(creditCardPin, 10);
        const hashedConfirmCreditCardPin = await bcrypt.hash(confirmCreditCardPin, 10);

        // Update the credit card PIN
        user.userCreditCardDetails[0].userCreditCardPin.userCreditcardpin = hashedCreditCardPin;
        user.userCreditCardDetails[0].userCreditCardPin.confirmuserCreditcardpin = hashedConfirmCreditCardPin;

        await user.save();

        return res.json({ success: true, message: 'Credit card PIN generated successfully' });
    } catch (error) {
        console.error(error); // Log the specific error here
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




  router.post('/updateCreditCardDetails', async (request, response) => {
    try {
        const { userAccountNumber, creditCardDetails } = request.body;

        const user = await UserDetailsAccounts.findOne({ userAccountNumber });

        if (user) {
            if (!user.userCreditCardDetails) {
                user.userCreditCardDetails = [];
            }
            user.userCreditCardDetails.push(creditCardDetails);

            await user.save();

            return response.status(200).json({ message: 'Credit card details updated successfully' });
        } else {
            return response.status(404).json({ message: 'User account not found' });
        }
    } catch (error) {
        console.error(error.message, 'update-credit-card-details');
        return response.status(500).json({ message: 'Internal Server Error at Credit Card Details Update' });
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

        // Save transaction data
        const savedData = await QuickFundTransferModel.create(quickFundTransferData);

        // Validate that amount is a valid numeric value
        const isValidAmount = !isNaN(quickFundTransferData.amount);

        if (!isValidAmount) {
            return res.status(400).json({ error: 'Invalid amount' });
        }

        // Deduct the amount from the source account
        await UserDetailsAccounts.updateOne(
            { userAccountNumber: quickFundTransferData.transferForm },
            { $inc: { userAccountBalance: -parseInt(quickFundTransferData.amount) } }
        );

        // Credit the amount to the destination account
        await UserDetailsAccounts.updateOne(
            { userAccountNumber: quickFundTransferData.toAccountNumber },
            { $inc: { userAccountBalance: parseInt(quickFundTransferData.amount) } }
        );

        return res.json(savedData);
    } catch (error) {
        console.error('Error in quickFundTransfer:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});



router.post('/debit-notification', async (req, res) => {
    try {
        const { email, amountDebited } = req.body;

        // Validate that amount is a valid numeric value
        const isValidAmount = !isNaN(amountDebited);
        if (!isValidAmount) {
            return res.status(400).json({ error: 'Invalid amount' });
        }

        // Deduct the amount from the user's account
        const userAccountNumber = req.body.userAccountNumber; // Assuming user account number is provided in the request
        await UserDetailsAccounts.updateOne(
            { userAccountNumber: userAccountNumber },
            { $inc: { userAccountBalance: -amountDebited } }
        );
        



        // Get user details for sending notification
        const user = await UserDetailsAccounts.findOne({ userEmailId: email });

        const nodemailer = require('nodemailer');
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            service: 'gmail',
            port: 465,
            secure: true,
            auth: {
              user: "gsathya567@gmail.com",
              pass: 'vrjk vaea htjj frhd'
              
              
            }
            
        });


        const mailOptions = {
            from: 'gsathya567@gmail.com',
            to: email,
            subject: 'Debit Notification',
            html: `
                <div>
                    <p>Dear ${user.accountHolderName},</p>
                    <p>An amount of ${amountDebited} has been debited from your account.and credited to satya</p>
                    <div>Warm regards,</div>
                    <div>Royal Islamic Bank (RIB)</div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({ success: true, message: 'Debit notification sent successfully' });
    } catch (error) {
        console.error(error);
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
     if(payLaterAccount.totalAmountPayable>0){
        payLaterAccount.utilisedLimit = 0;
        payLaterAccount.availableLimit = payLaterAccount.totalCreditLimit;
        payLaterAccount.dueDate = '';
        payLaterAccount.totalAmountPayable = 0;
        await payLaterAccount.save();
    
        return res.status(200).json({ message: 'Payment successful', payLater: payLaterAccount });
     }
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






// Block Credit Card APIS starts
const BlockCreditCard = require("../models/blockcreditCroutes");

router.post('/blockcreditcard', async (req, res) => {
    const { creditCardNumber } = req.body;
  
    // Check if credit card number already exists
    const existingCreditCard = await BlockCreditCard.findOne({ creditCardNumber });
    if (existingCreditCard) {
        existingCreditCard.isActive = false; // Mark the existing credit card as inactive
        await existingCreditCard.save();
        return res.status(201).json({ message: 'Credit card number already exists and has been blocked' });
    }
  
    try {
      const { cardHolderName, ExpiryDate, CVVNumber, reason,  email  } = req.body;
      const blockedCreditCard = new BlockCreditCard({
        creditCardNumber,
        cardHolderName,
        ExpiryDate,
        CVVNumber,
        reason,
        email
      });
      await blockedCreditCard.save();
      res.status(200).json(blockedCreditCard);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
});

router.get('/blockcreditcard', async (req, res) => {
    try {
      const blockedCreditCards = await BlockCreditCard.find();
      res.json(blockedCreditCards);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

router.get('/blockcreditcard/:id', getBlockedCreditCard, (req, res) => {
    res.json(res.blockedCreditCard);
  });
  
  // Middleware to retrieve a single blocked credit card entry by ID
  async function getBlockedCreditCard(req, res, next) {
    let blockedCreditCard;
    try {
      blockedCreditCard = await BlockCreditCard.findById(req.params.id);
      if (blockedCreditCard == null) {
        return res.status(404).json({ message: 'Blocked credit card not found' });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  
    res.blockedCreditCard = blockedCreditCard;
    next();
  }

  router.delete("/blockcreditcard/:id", async (req, res) => {
    try {
        const blockedCreditCards = await BlockCreditCard.findByIdAndDelete(req.params.id);
        if (!blockedCreditCards) {
          return res.status(404).send({ message: 'Credit Card not Found' });
        }
        res.send({ message: 'Credit Card deleted successfully' });
      } catch (error) {
        return res.status(500).json({ message: "Internal Server Error ...!" });
      }
  });


  router.post("/OtpValidation", async (req, res) => {
    try {
      const { email } = req.body;
      
      const user = await BlockCreditCard.findOne({ email });
      if (!user) {
        return res.status(404).json({error: "User not found"});
      }
      const otpCode = Math.floor(100000 + Math.random() * 900000);
      user.otp = otpCode;
      console.log(otpCode);
      await user.save()
      sendEmail({
        to: email,
        subject:"OTP for Credit Card Block",
        templateName:"/mail/templates/creditcard-otp.hbs",
        context:{
          otp_title: "OTP for Credit Card Block",
          userName: user. cardHolderName,
          otp: otpCode,
          company: "Royal Islamic Bank"
        }
      })
      return res.status(200).json({ message: `An otp has been sent to your email address`})
    }
    catch (error){
      console.error("Error sending otp:", error);
      res.status(500).json({error: "Internal server error"});
    }
  });
  router.post("/verifyOTP/:email", async (req, res) => {
    try {
        const { email } = req.params;
        const { otp } = req.body;
        const user = await BlockCreditCard.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (user.otp === otp) {
            // OTP matches, set credit card status to inactive
            user.StatusActive = false;
            await user.save();
            return res.status(200).json({ message: "OTP verification successful. Credit card blocked." });
            
        } else {
            
            return res.status(400).json({ error: "Invalid OTP. Credit card blocked." });
        }
    } catch (error) {
        console.error("Error verifying OTP", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


  // Block Credit Card APIS ends

  //Alert Subscrition APIs Starts
  const AlertSubscription = require("../models/alertSubscription");
  router.post('/alertsubscription', async (req, res) => {
    const { CreditCardNumber } = req.body;
    console.log(req.body);
    // Check if credit card number already exists
   
  
    try {

        const existingCreditCard = await AlertSubscription.findOne({ CreditCardNumber });
        console.log(existingCreditCard);
        if (existingCreditCard) {
            console.log("test1");
            existingCreditCard.isActive = false; // Mark the existing credit card as inactive
            await existingCreditCard.save();
            console.log("test2");
    
            return res.status(201).json({ message: 'You Already Subscribed for SubscriptionAlert Notifications' });
        }
        console.log("test3");

      const { emailAddress,  MobileNumber, subscriptionStatus } = req.body;
      const subscriptionAlert = new AlertSubscription({
        CreditCardNumber,
        MobileNumber,
        emailAddress,
        subscriptionStatus
      });
      console.log("test4");
      console.log(subscriptionAlert);

      await AlertSubscription.create(req.body);
      res.status(200).json({ message: ' Subscribed for SubscriptionAlert Notifications' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
});
router.delete("/alertsubscription/:id", async (req, res) => {
    try {
        const SubscriptionAlert = await AlertSubscription.findByIdAndDelete(req.params.id);
        if (!SubscriptionAlert) {
          return res.status(404).send({ message: 'Credit Card Details Was not Found' });
        }
        res.send({ message: 'Credit Card Subcription Alert Notification Deleted Successfully' });
      } catch (error) {
        return res.status(500).json({ message: "Internal Server Error ...!" });
      }
  });


  //Alert Subscrition APIs ends





router.post('/updateCreditCardTransactions', async (request, response) => {
    try {
        const { userAccountNumber, transactions } = request.body;

        const user = await UserDetailsAccounts.findOne({ userAccountNumber });

        if (user) {
            if (!user.creditCardTransactions) {
                user.creditCardTransactions = [];
            }
            user.creditCardTransactions.push(...transactions);

            await user.save();

            return response.status(200).json({ message: 'Credit card transactions updated successfully' });
        } else {
            return response.status(404).json({ message: 'User account not found' });
        }
    } catch (error) {
        console.error(error.message, 'update-credit-card-transactions');
        return response.status(500).json({ message: 'Internal Server Error at Credit Card Transactions Update' });
    }
});


router.put('/userDetails/:accountNumber/emiConversion', async (request, response) => {
    try {
        const accountNumber = request.params.accountNumber;
        const { emiTenure, transactions, totalProcessingFee, totalEMIAmount,emi, isChecked } = request.body;

        if (!transactions || !Array.isArray(transactions)) {
            return response.status(400).json({ message: 'Transactions array is missing or invalid' });
        }

        const userDetails = await UserDetailsAccounts.findOne({ userAccountNumber: accountNumber });

        if (!userDetails) {
            return response.status(404).json({ message: 'User not found with the provided account number' });
        }

        for (const transaction of transactions) {
            const transactionId = transaction._id;
            
            const selectedTransaction = userDetails.creditCardTransactions.find(t => t._id.toString() === transactionId);
            if (selectedTransaction) {
                const newEmiConversion = {
                    emiTenure,
                    processingFee: totalProcessingFee,
                    totalEmi: totalEMIAmount,
                    emi,
                    isChecked,
                    createdAt: new Date()
                };

                selectedTransaction.convertToEMI.push(newEmiConversion);
            }
        }

        await userDetails.save();

        return response.status(201).json({ message: 'EMI conversion added successfully', details: userDetails });
    } catch (error) {
        console.error(error.message, 'Error adding EMI conversion');
        return response.status(500).json({ message: 'Internal Server Error at EMI Conversion API' });
    }
});



router.post('/autodebit/yes', async (req, res) => {
    try {
        const { selectedCreditCard, selectedAccount, autodebitMode, setupAutoDebit } = req.body;
       
        if (!selectedCreditCard || !selectedAccount || !autodebitMode || !setupAutoDebit) {
            return res.status(400).json({ error: 'Missing fields in request body' });
        }

        const userAccount = await UserDetailsAccounts.findOne({ userAccountNumber: selectedAccount });

        if (!userAccount) {
            return res.status(404).json({ error: 'User account not found' });
        }

        if (setupAutoDebit === 'yes') {

            if (!userAccount.userCreditCardDetails.autoDebitSetup) {
                userAccount.userCreditCardDetails.autoDebitSetup = [];
            }

            const existingSetup = userAccount.userCreditCardDetails.autoDebitSetup.find(setup => setup.setupAutoDebit === 'yes');
            if (existingSetup) {
                userAccount.userCreditCardDetails.autoDebitSetup = userAccount.userCreditCardDetails.autoDebitSetup.filter(setup => setup.setupAutoDebit !== 'yes');
            }

            userAccount.userCreditCardDetails.autoDebitSetup.push({ autodebitMode, setupAutoDebit });

            await userAccount.save();

            res.status(200).json({ message: 'Data posted successfully.' });
        } else {
            res.status(400).json({ error: 'Invalid value for setupAutoDebit when processing "yes".' });
        }
    } catch (error) {
        console.error('Error posting data:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});


// Route for deleting data when setupAutoDebit is 'no'
router.post('/autodebit/no', async (req, res) => {
    try {
        const { selectedCreditCard, selectedAccount, setupAutoDebit } = req.body;

        if (!selectedCreditCard || !selectedAccount || !setupAutoDebit) {
            return res.status(400).json({ error: 'Missing fields in request body' });
        }

        const userAccount = await UserDetailsAccounts.findOne({ userAccountNumber: selectedAccount });

        if (!userAccount) {
            return res.status(404).json({ error: 'User account not found' });
        }

        if (setupAutoDebit === 'no') {

            userAccount.userCreditCardDetails.autoDebitSetup = [];
            
            await userAccount.save();

            res.status(200).json({ message: 'Data deleted successfully.' });
        } else {
            res.status(400).json({ error: 'Invalid value for setupAutoDebit when processing "no".' });
        }
    } catch (error) {
        console.error('Error deleting data:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

router.post("/loan-accounts", async (req, res) => {
    try {
      const newLoanAccount = new LoanAccount(req.body);
      const savedLoanAccount = await newLoanAccount.save();
      res.json(savedLoanAccount);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  
  });
  
  // Get all loan accounts
  router.get("/loan-accounts", async (req, res) => {
  
      try {
        const loanAccounts = await LoanAccount.find();
        res.json(loanAccounts);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });
    
    router.get("/loan-accounts/:id", async (req, res) => {
      const { id } = req.params;
    
      try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).json({ message: "Invalid Loan Account ID" });
        }
    
        const loanAccount = await LoanAccount.findOne({ _id: id });
    
        if (!loanAccount) {
          return res.status(404).json({ message: "Loan Account Not Found" });
        }
    
        const {
          accountnumber,
          sanctionedAmount,
          principalAmount,
          currentAmount,
          dueDate,
          overdueAmount /* other fields */,
        } = loanAccount;
    
        const loanAccountDetails = {
          accountnumber,
          sanctionedAmount,
          principalAmount,
          currentAmount,
          dueDate,
          overdueAmount,
        };
    
        res.status(200).json({ loanAccountDetails });
      } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Internal Server Error" });
      }
    });
    
  
    router.post("/fixeddeposites", async (req, res) => {
      try {
        const fixedDeposites = new FixedDeposites(req.body);
        await fixedDeposites.save();
    
        return res
          .status(200)
          .json({ message: "Fixed deposit details saved successfully" });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    });
    router.get("/fixeddeposites", async (req, res) => {
      try {
        const allfixeddeposites = await FixedDeposites.find({});
        res.json(allfixeddeposites);
      } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Internal server error" });
      }
    });
  
    router.post("/generate-pdf", async (req, res) => {
      const { email, selectedOption } = req.body;
    
      try {
        let selectedOption = await FixedDeposites.findOne({ userEmailId: email });
    
        if (!selectedOption) {
          return res
            .status(400)
            .json({ success: false, message: "User not found." });
        }
    
        if (selectedOption === "sendAdvice") {
          await sendAdviceEmail(email);
        } else if (selectedOption === "downloadDevice") {
          await generateAndDownloadPDF(res);
        } else {
          return res
            .status(400)
            .json({ success: false, message: "Invalid selected option." });
        }
        async function sendAdviceEmail(email) {
          const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            service: "gmail",
            port: 465,
            auth: {
              user: "meenakshichitikila@gmail.com",
              pass: "Meenakshi@1234",
            },
          });
        
          const mailOptions = {
            from: "meenakshichitikila@gmail.com",
            to: email,
            subject: "FD Advice",
            text: "Here is your FD advice.",
          };
        
          await transporter.sendMail(mailOptions);
        }
        
        async function generateAndDownloadPDF(res) {
          const pdfDoc = await pdfLib.Document.create();
          const page = pdfDoc.addPage();
          const { width, height } = page.getSize();
          page.drawText("Fixed Deposit Advice", { x: 50, y: height - 50 });
        
          const pdfBytes = await pdfDoc.save();
        
          res.setHeader("Content-Type", "application/pdf");
          res.setHeader("Content-Disposition", "attachment; filename=fd_advice.pdf");
          res.send(pdfBytes);
        }
        res.json({
          success: true,
          message: "PDF generated or email sent successfully.",
        });
      } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
      }
    });
    
  
  module.exports = router;
  
   
