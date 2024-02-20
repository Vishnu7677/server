const express = require("express");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const userDetails = require("../models/useAccounts");
const { sendEmail } = require("../emailServiecs");
const Verifier = require("email-verifier");

const router = express.Router();

router.post("/userdetails", async (req, res) => {
  try {
    const email = req.body.email;
    console.log(email);

    const findUser = await userDetails.findOne({ email: email });

    if (!findUser) {
      return res.status(402).json({ message: "user does not exist" });
    }

    console.log(findUser);

    const newUser = await userDetails.findOneAndUpdate(
      { email: email },
      req.body
    );
    return res
      .status(200)
      .json({ message: "user Created successfully...", newUser });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.get("/userdetails", async (req, res) => {
  try {
    const userdetails = await userDetails.find();
    return res.status(200).json(userdetails);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;
    let verifier = new Verifier("at_2XUhGRqNd5zW44WdxmXMZMNB2W9Ak");

    verifier.verify(email, async (err, data) => {
      console.log(data.smtpCheck);
      if (data.smtpCheck === "false") {
        console.log("sadhbjavvy");
        return res.status(500).json({ message: "Invalid email address" });
      }

      console.log("hghghuwghuygyu");

      // Generate OTP (you may use a library for this)
      const OTP = Math.floor(1000 + Math.random() * 9000);

      // Set OTP and OTP expiration in the user document
      const expirationTime = new Date();
      expirationTime.setMinutes(expirationTime.getMinutes() + 1); // Set OTP expiration to 5 minutes from now

      // Update user details with OTP and expiration time
      await userDetails.findOneAndUpdate(
        { email },
        { otp: OTP, otpExpiration: expirationTime },
        { upsert: true }
      );

      // Send email with OTP
      const formatDate = (dateString) => {
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(dateString).toLocaleDateString(undefined, options);
      };
      sendEmail({
        to: email,
        subject: `OTP verification by RIB`,
        templateName: "mail/templates/AccountopeningOtp.hbs",
        context: {
          otp: OTP,
          request_date: formatDate(new Date()),
        },
      });
      return res.status(200).json({ message: "OTP sent successfully" });
    });
  } catch (err) {
    console.error("Error in try-catch:", err);
    return res.status(402).json({ message: "An error occurred" });
  }
});

router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find the user by email
    const user = await userDetails.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the OTP matches
    if (otp === user.otp) {
      // Check if the OTP has not expired
      if (new Date() < user.otpExpiration) {
        // Mark the email as verified in the database
        await userDetails.findOneAndUpdate({ email }, { verified: true });

        return res.status(200).json({ message: "OTP verified successfully" });
      } else {
        return res.status(401).json({ message: "OTP has expired" });
      }
    } else {
      return res.status(401).json({ message: "Invalid OTP" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.post("/store-email", async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the email already exists in the database
    const existingEmail = await userDetails.findOne({ email });

    if (existingEmail) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists." });
    }

    // Create a new instance of the Email model and save it to the database
    const newEmail = new userDetails({ email });
    await newEmail.save();

    res
      .status(200)
      .json({ success: true, message: "Email stored successfully." });
  } catch (error) {
    console.error("Error storing email in MongoDB:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

router.get("/requesteduserdetails", async (req, res) => {
  try {
    const alluserdetails = await userDetails.find();
    return res.status(200).json(alluserdetails);
  } catch (error) {
    // Handle errors

    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/individualrequesteduserdetails/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const user = await userDetails.findOne({ email: email });
    if (user) {
      return res.status(200).json(user);
    }
    return res.status(404).json({ message: "User Not Found." });
  } catch (error) {
    // Handle errors

    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/add-account-details/:email", async (req, res) => {
  const { email } = req.params;
  let { ifscCode, netBankingUserID, netBankingPassword } = req.body;
  let accountNumber;
  try {
    // Find the user details by email
    const userDetail = await userDetails.findOne({ email });

    if (!userDetail) {
      return res.status(404).json({ error: "User details not found" });
    }

    const hashedPassword = await bcrypt.hash(netBankingPassword, 10);

    // Check if the user already has an account number, if not generate one
    if (!userDetail.accountNumber) {
      try {
        // Find the latest account number
        const latestUser = await userDetails.findOne(
          {},
          {},
          { sort: { accountNumber: -1 } }
        );

        // Generate new account number by incrementing the previous one
        if (latestUser && latestUser.accountNumber) {
          const lastAccountNumber = parseInt(
            latestUser.accountNumber.substr(3)
          );
          accountNumber =
            "RIB" + (lastAccountNumber + 1).toString().padStart(10, "0");
        } else {
          // If no account numbers found, start from RIB0000000001
          accountNumber = "RIB0000000001";
        }
      } catch (error) {
        console.error("Error generating account number:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
    }

    // Update or add the account details
    userDetail.accountNumber = accountNumber;
    userDetail.ifscCode = ifscCode;
    userDetail.netBankingUserID = netBankingUserID;
    userDetail.netBankingPassword = hashedPassword;
    // Save the updated user details
    await userDetail.save();
    const formatDate = (dateString) => {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(dateString).toLocaleDateString(undefined, options);
    };
    sendEmail({
      to: email,
      subject: `Welcome to RIB  `,
      templateName: "mail/templates/AccountDetailsSending.hbs",
      context: {
        full_name: `${userDetail.firstname} ${userDetail.lastname}`,
        account_number: accountNumber,
        netBanking_User_ID: netBankingUserID,
        ifsc_code: ifscCode,
        netBanking_Password: netBankingPassword,
        opened_date: formatDate(new Date()),
      },
    });
    res.json({ message: "Account details updated successfully", userDetail });
  } catch (error) {
    console.error("Error updating account details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
