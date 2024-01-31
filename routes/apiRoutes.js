const express = require("express");
const router = express.Router();

const {UserDetailsAccounts,PayLaterAccount} = require('../models/userAccountDetails');
const { default: mongoose } = require("mongoose");

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