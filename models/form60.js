const mongoose = require('mongoose');

const updateForm60Details = new mongoose.Schema({
    savingsAccountNumber: {
        type: Number,  
        trim: true,
      },
      declarentsName:{
        type: String,
        trim:true,
      },
      declarentsDOB:{
        type: Date,  
      },
      fathersName:{
        type: String,
        trim:true,
      },
      AddressLine1:{
        type: String,
        trim:true,
      },
      AddressLine2:{
        type: String,
        trim:true,
      },
      TownCity:{
        type: String,
        trim:true,
      },
      State:{
        type: String,
        trim:true,
      },
      PinCode:{
        type: Number,  
        trim: true,
      },
      AmountOfTransaction:{
        type: Number,  
        trim: true,
      },
      DateOfTransaction:{
        type: Date,  
      },
      AgriculturalIncome:{
        type: Number,  
        trim: true,
      },
      IncomeFromOtherSource:{
        type: Number,  
        trim: true,
      },
      PANAcknowledgeNumber:{
        type: String,
        trim:true,
      },
      PANApplicationDate:{
        type: Date,  
      },
      TelephoneNumber:{
        type: Number,
      },
      MobileNumber:{
        type: Number,
      },
      EmailID:{
        type: String,
      },
    
      communicationMethod: {
        type: String,
        enum: ['SMS', 'Email', 'Call'],
       
      }, 
})

const Form60Details= mongoose.model('Form60Details', updateForm60Details);

module.exports = Form60Details;