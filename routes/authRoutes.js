const express = require("express");

const router = express.Router();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { UserDetails } = require('../models/useAccounts');

router.post("/change-password", (req, res) => {

    res.send("Password change route");
});

router.post("/reset-password", (req, res) => {

    res.send("Password reset route");
});


router.put("/update-profile", (req, res) => {
    res.send("Update user profile route");
});

router.delete("/delete-account", (req, res) => {

    res.send("Delete user account route");
});


router.post("/refresh-token", (req, res) => {

    res.send("Refresh token route");
});

router.get("/", (req, res) => {
    res.send("royal islamic bank server auth routes")
});

router.post("/login-netbanking", async (request, response) => {
    try {
        const { userId, password } = request.body;
        const isUserIdFound = await UserDetails.findOne({ netBankingUserID: userId });

        if (isUserIdFound) {

            //const isPasswordValid = await bcrypt.compare(password, isUserIdFound.netBankingPassword);

            if (isUserIdFound.netBankingPassword ===  password) {
                let payLoad = {
                    id: isUserIdFound._id
                }
                let token = jwt.sign(payLoad, "RIB_SECRETE_KEY", { expiresIn: '1m' });
                return response.status(200).json({ token: token, message: "Login Successfully!" })
            } else {
                return response.status(400).json({ message: 'Enter Valid Password' })
            }
        } else {
            return response.status(400).json({ message: 'Enter Valid User ID' })
        }
    } catch (error) {
        console.log(error.message, 'Netbanking Login');
        return response.status(500).json({ message: 'Internal Server Error at Netbanking Login' })
    }
});

router.post('/forgot-password-otp', async (req, res) => {
    try {
        const otpCode = Math.floor(100000 + Math.random() * 900000);
        const email = req.body.email;

        const responseType = {};

        let user = await UserDetails.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Email not found' });
        }
         else {
            // Update the user with the new OTP
            user.otp = otpCode;
            await user.save();

            responseType.statusText = "Success";
            responseType.message = `OTP has been sent to ${email}`;

            // Send email
            const nodemailer = require('nodemailer');
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                service: 'gmail',
                port: 465,
                secure: true,
                auth: {
                    user: "giribabu8719@gmail.com",
                    pass: 'dvfe ptfi maek rneh'
                }
            });

            const mailOptions = {
                from: 'giribabu8719@gmail.com',
                to: email,
                subject: 'Royal Islamic Bank Forgot Password',
                html:
                    `<div>
                    <p>Dear ${user.firstname} ${user.lastname},</p>
                    <p>Your OTP is ${otpCode}. Do not share it with anyone. This is confidential and should be used by you only.</p>
                    <div>Warm regards,</div>
                    <div>Royal Islamic Bank (RIB)</div>
                </div>`
            };

            await transporter.sendMail(mailOptions);

            res.status(200).json(responseType);
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            statusText: "error",
            message: "Internal Server Error at Forgot Password OTP",
        });
    }
});

router.post('/verify-forgot-password-otp', async (request, response)=> {
    try {
        const email = request.body.email;
        const { gmailOTP } = request.body;
        const isMailExists = await UserDetails.findOne({email: email});
        if(isMailExists)
        {
            if(isMailExists.otp === gmailOTP){
                return response.status(200).json({ message: 'Valid OTP?' });
            }
            else{
                return response.status(400).json({ message: 'Invalid OTP?' });
            }
        }
        else{
            return response.status(400).json({message: 'Email Not Found'});
        }
    } 
    catch (error) {
        console.log(error.message, 'OTP Verification');
        return response.status(500).json({message: 'Internal server error at Forgot Password OTP Verification'})
    }
});

router.put('/update-newpassword', async (request, response) => {
    try {
        const { email, newPassword } = request.body;
        const isCustomerExist = await UserDetails.findOne({email: email});
    
        if(isCustomerExist){
            isCustomerExist.netBankingPassword = newPassword;
            await isCustomerExist.save()
            return response.status(200).json({message: 'New Password Updated'})
        }
        else{
            return response.status(400).json({message: 'Customer Mail ID Not Found!'})
        }
    } 
    catch (error) {
        console.log('Error at Updating Personal Banking Password', error);
        return response.status(500).json({ error: "Internal Server Error at Updation of Password" });
    }
});

module.exports = router;