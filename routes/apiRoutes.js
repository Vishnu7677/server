const express = require("express");
const router = express.Router();
const PDFDocument = require("pdfkit");
const fs = require("fs");
const AWS = require("aws-sdk")
const UserDetailsAccounts = require('../models/userAccountDetails');

const InterestCertificate = require('../models/userAccountDetails');




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
             

        if (isAccountNumExists) {
            return response.status(400).json({ message: 'Account is already exists in bank' });
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

module.exports = router;