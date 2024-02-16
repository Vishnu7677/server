const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

 

const path = require("path");

const dbConfig = require('./utils/dbConfig');
// sairam inwardremitance code starts
const apiRoutes = require('./routes/apiRoutes');
// sairam inwardremitance code ends
const dotenv = require('dotenv');



// 
const bodyParser = require('body-parser');
require('dotenv').config();
  
// 
// const {TaxsendOTP, TaxverifyOTP } = require('./controllers/otpController');
const {generateOTP, resendOTP, TaxverifyOTP } = require('./controllers/otpController');

// app.use('/api/auth', authRoutes);
 



const {UserDetailsAccounts} = require("./models/userAccountDetails");





const app = express();
const port = 4444 || process.env.PORT


// 
app.use(bodyParser.json());
// aadhar
app.use(bodyParser.urlencoded({ extended: true }));
 
// aadhar
app.use(cors()) ;
app.use(express.json());
require('dotenv').config()
// scheduled starts 
// app.use(bodyParser.urlencoded({ extended: false }));
// scheduled ends

mongoose.connect(dbConfig, {
    useNewUrlParser: true,
    useUnifiedTopology: true ,
    
  })
.then(()=>console.log('DB Connected'))
.catch((error)=>console.log(error));

// 

  // inward remittance sched starts 
  const inwardRemittanceRoutes = require('./routes/apiRoutes');
  app.use('/api', inwardRemittanceRoutes);

  app.use('/api', apiRoutes);
// inward remittance sched ends 
// 


app.post('/api/generate-otp', generateOTP );
app.post('/api/resend-otp', resendOTP );

// app.post('/api/send-OneTP', TaxsendOTP);
app.post('/api/verify-OneTP', TaxverifyOTP);




app.use("/auth", require("./routes/authRoutes")); 
app.use("/api", (require("./routes/apiRoutes")));
app.use("/form60Userdetails", require("./routes/form60routes")); 

app.listen(port, ()=>console.log(`Server Running at ${port}`));         




























 