const express = require("express");
const Form60Details = require("../models/form60");
const { sendEmail } = require("../emailServiecs");
const router = express.Router();

//creating update form 60 user details

router.post("/userdetails", async (req, res) => {
    try {
      const newform60Userdetails = new Form60Details(req.body);
      await newform60Userdetails.save();
  
      return res.status(200).json({ message: "Update form60 user details created...!" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server Error" });
    }
  });
  //Getting All update form 60 user details
  router.get("/userdetails", async (req, res) => {
    try {
      const form60Userdetails = await Form60Details.find();
      res.json(form60Userdetails);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server Error" });
    }
  });
  //Getting single update form 60 user details
  router.get('/userdetails/:id', async (req, res) => {
    try {
      const form60Userdetails = await Form60Details.findById(req.params.id);
      if (!form60Userdetails) {
        return res.status(404).send({ message: 'User Details Not Found' });
      }
      res.send(form60Userdetails);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
  });
 //Delete the userdetails
 router.delete("/userdetails/:id", async (req, res) => {
    try {
        const form60Userdetails = await Form60Details.findByIdAndDelete(req.params.id);
        if (!form60Userdetails) {
          return res.status(404).send({ message: 'User Details Not Found' });
        }
        res.send({ message: 'User Details deleted successfully' });
      } catch (error) {
        return res.status(500).json({ message: "Internal Server Error ...!" });
      }
  });


  //otp validation
  router.post("/send-otp", async (req, res) => {
    try {
      const { EmailID } = req.body;
      
      const user = await Form60Details.findOne({ EmailID });
      if (!user) {
        return res.status(404).json({error: "User not found"});
      }
      const otpCode = Math.floor(100000 + Math.random() * 900000);
      user.otp = otpCode;
      console.log(otpCode);
      await user.save()
      sendEmail({
        to: EmailID,
        subject:"OTP for form60 Verification",
        templateName:"/mail/templates/password-otp.hbs",
        context:{
          otp_title: "OTP for account verification",
          userName: user.declarentsName,
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
router.post("/verify-otp/:EmailID", async (req, res) =>{
  try{
    const { EmailID } = req.params
    const { enteredOtp } = req.body;
    const user = await Form60Details.findOne({ EmailID });
    
    if (!user) {
      return res.status(404).json({error: "User not found"});
    }
    if(user.otp === enteredOtp){
      //otp matches, you can perform further actions 
      return res.status(200).json({ message: "OTP verification successful"});
    }else{
      //OTP does not match
      return res.status(400).json({error: "Invalid OTP"});
    }

  }catch (error) {
    console.error("Error verufying OTP",error);
    res.status(500).json({error: "Internal Server Error"});

  }
})

module.exports = router