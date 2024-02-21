const mongoose = require('mongoose');

const updateForm60Details = new mongoose.Schema({
    savingsAccountNumber: {
        type: Number,  
       
      },
      declarentsName:{
        type: String,
        
      },
      declarentsDOB:{
        type: Date,  
      },
      fathersName:{
        type: String,
        
      },
      AddressLine1:{
        type: String,
       
      },
      AddressLine2:{
        type: String,
        
      },
      TownCity:{
        type: String,
              },
      State:{
        type: String,
        
      },
      PinCode:{
        type: Number,  
       
      },
      AmountOfTransaction:{
        type: Number,  
        
      },
      DateOfTransaction:{
        type: Date,  
      },
      AgriculturalIncome:{
        type: Number,  
       
      },
      IncomeFromOtherSource:{
        type: Number,  
        
      },
      PANAcknowledgeNumber:{
        type: String,
        
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
      otp:String,

})

const Form60Details= mongoose.model('Form60Details', updateForm60Details);

module.exports = Form60Details;