const PhoneNumber = require('libphonenumber-js');

const accountSid = 'AC97e881d061710d39ae499bb1797a8a0a';
const authToken = 'f5e7dfc8b42c59f95fe435e42ed24718';
const twilioPhoneNumber = '+17622254672';

const client = require('twilio')(accountSid, authToken);
const nodemailer = require('nodemailer');

const emailTransporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: 'penumakapraveen85@gmail.com',
        pass: 'Vishnu@7677',
    },
});

const sendSmsOtp = (mobileNumber, otp) => {

    const parsedNumber = PhoneNumber.parse(mobileNumber, 'IN');
    const formattedMobileNumber = PhoneNumber.format(parsedNumber, 'E.164');

    client.messages
        .create({
            body: `Your OTP is ${otp}`,
            from: twilioPhoneNumber,
            to: formattedMobileNumber,
        })
        .then((message) => console.log(`SMS sent with SID: ${message.sid}`))
        .catch((error) => console.error('Error sending SMS:', error));
};

const sendEmailOtp = (email, otp) => {
    const mailOptions = {
        from: 'penumakapraveen85@gmail.com',
        to: email,
        subject: 'OTP for Verification',
        text: `Your OTP is ${otp}`,
    };


    emailTransporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};

const sendCallOtp = (mobileNumber, otp) => {
    client.calls
        .create({
            twiml: `<Response><Say>Your OTP is ${otp}</Say></Response>`,
            to: mobileNumber,
            from: twilioPhoneNumber,
        })
        .then((call) => console.log(`Call sent with SID: ${call.sid}`))
        .catch((error) => console.error('Error sending call:', error));
};

const sendOTP = (otpMethod, mobileNumber, email, otp) => {
    if (otpMethod === 'sms') {
        sendSmsOtp(mobileNumber, otp);
    } else if (otpMethod === 'email') {
        sendEmailOtp(email, otp);
    } else if (otpMethod === 'call') {
        sendCallOtp(mobileNumber, otp);
    } else {
        console.error('Invalid OTP method:', otpMethod);
    }
};

module.exports = sendOTP;
