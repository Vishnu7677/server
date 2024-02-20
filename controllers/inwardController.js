 const UserINRM = require('../models/User')
 const nodemailer = require('nodemailer');

exports.submitForm = async (req, res) => {
  try {
    const {accountNumber,
       beneficiaryName,
        beneficiaryAddress,
         beneficiaryAccountNumber,
          beneficiaryIfscCode,
           PhoneNumber,
            reviewAccuracy,
             purposeOfRemittance,
              bookFXDeal,
              amount, currency
             } = req.body;

    const newUser = new UserINRM({
      accountNumber,
      beneficiaryName,
      beneficiaryAddress,
      beneficiaryAccountNumber,
      beneficiaryIfscCode,
      PhoneNumber,
      reviewAccuracy,
      purposeOfRemittance,
      bookFXDeal,
      amount, // Include amount in the newUser object
      currency,
    });

    // Save the user data to MongoDB
    await newUser.save();

   // Send email to bank
     const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'borigamsairam7009@gmail.com',
        pass: 'gxtt xpdm tjts sfms',
      },
    });

    const mailOptions = {
      from: 'borigamsairam7009@gmail.com',
      to: 'sairamborigam21@gmail.com',
      subject: 'Inward Remittance Request',
      text: `User with account number ${accountNumber} is trying to request inward remittance.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).send('Error sending email');
      } else {
        console.log('Email sent: ' + info.response);
        res.status(200).send('Form submitted successfully');
      }
    });
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).send('Internal server error');
  }
};
























 
