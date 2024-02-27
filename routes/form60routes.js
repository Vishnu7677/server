const express = require("express");
const Form60Details = require("../models/form60");
const { sendEmail } = require("../emailServiecs");
const router = express.Router();

//creating update form 60 user details

router.post("/userdetails", async (req, res) => {
  try {
      const { EmailID } = req.body;
      // Check if the email already exists in the database
      const existingUser = await Form60Details.findOne({ EmailID });

      if (existingUser) {
          // If the email already exists, return a message indicating that the user is already registered
          return res.status(400).json({ message: "User already registered. Use a different email for update." });
      }

      // If the email does not exist, proceed with saving the new user details
      const newform60Userdetails = new Form60Details(req.body);
      await newform60Userdetails.save();

      return res.status(200).json({ message: "Update form60 user details created...!" });
  } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server Error" });
  }
});


  //Getting All update form 60 user details
//   router.post("/register-and-send-otp", async (req, res) => {
//     try {
//         const { EmailID } = req.body;

//         // Check if user with provided email already exists
//         let user = await Form60Details.findOne({ EmailID });

//         if (!user) {
//             // If user does not exist, create a new user
//             user = new Form60Details({ EmailID });

//             // Generate OTP for user
//             const otpCode = Math.floor(100000 + Math.random() * 900000);
//             user.otp = otpCode;
//             await user.save();

//             // Send OTP to the user's email
//             await sendEmail({
//                 to: EmailID,
//                 subject: "OTP for form60 Verification",
//                 templateName: "/mail/templates/password-otp.hbs",
//                 context: {
//                     otp_title: "OTP for account verification",
//                     userName: user.declarentsName,
//                     otp: otpCode,
//                     company: "Royal Islamic Bank",
//                 },
//             });

//             return res.status(200).json({ message: `New user created. An OTP has been sent to your email address` });
//         } else if (!user.otp) {
//             // If user exists but does not have an OTP, generate and send OTP
//             const otpCode = Math.floor(100000 + Math.random() * 900000);
//             user.otp = otpCode;
//             await user.save();

//             // Send OTP to the user's email
//             await sendEmail({
//                 to: EmailID,
//                 subject: "OTP for form60 Verification",
//                 templateName: "/mail/templates/password-otp.hbs",
//                 context: {
//                     otp_title: "OTP for account verification",
//                     userName: user.declarentsName,
//                     otp: otpCode,
//                     company: "Royal Islamic Bank",
//                 },
//             });

//             return res.status(200).json({ message: `An OTP has been sent to your email address` });
//         } else {
//             // If user exists and already has an OTP, return an error
//             return res.status(400).json({ error: "User with this email already exists and OTP already sent" });
//         }
//     } catch (error) {
//         console.error("Error registering user and sending OTP:", error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// });

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
 //Delete the userdetails.
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
});

// router.post("/verify-otp/:EmailID", async (req, res) =>{
//   try{
//     const { email } = req.params
//     const { enteredOtp } = req.body;
//     const user = await Form60Details.findOne({ email });
    
//     if (!user) {
//       return res.status(404).json({error: "User not found"});
//     }
//     if(user.otp === enteredOtp){
//       //otp matches, you can perform further actions 
//       return res.status(200).json({ message: "OTP verification successful"});
//     }else{
//       //OTP does not match
//       return res.status(400).json({error: "Invalid OTP"});
//     }

//   }catch (error) {
//     console.error("Error verufying OTP",error);
//     res.status(500).json({error: "Internal Server Error"});

//   }
// });



module.exports = router

// bit bash
// rm -rf node_modules