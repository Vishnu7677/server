const twilio = require('twilio');
const  TaxcenterOTP = require('../models/otp');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);

const TaxsendOTP = async (req, res) => {
  try {
    const { mobileNumber } = req.body;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await TaxcenterOTP.findOneAndUpdate(
      { mobileNumber },
      { otp },
      { new: true, upsert: true }
    );

    await client.messages.create({
      body: `Your OTP is: ${otp}`,
      to: mobileNumber,
      from: process.env.TWILIO_PHONE_NUMBER,
    });

    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
};

const TaxverifyOTP = async (req, res) => {
  try {
    const { mobileNumber, otp } = req.body;
 
    const user = await TaxcenterOTP.findOne({ mobileNumber });

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    if (user.otp !== otp) {
       return res.status(400).json({ error: 'Invalid OTP' });
    }

    // Clear OTP after successful verification
    // user.otp = '';
    // await user.save();

     res.json({ message: 'OTP verified successfully' });
  } catch (error) {
    // console.error('Error verifying OTP:', error);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
};

module.exports = { TaxsendOTP, TaxverifyOTP };


























 