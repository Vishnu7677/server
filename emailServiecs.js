const express = require("express");
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const nodemailer = require('nodemailer');
const currentDir = __dirname;

require('dotenv').config();


const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port:465,
    secure: true,
    auth:{
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD

    },
})

function sendEmail({to, subject, templateName, context}){
  const templatePath = path.join(currentDir, templateName);
  const source = fs.readFileSync(templatePath, 'utf-8');
  const template = handlebars.compile(source);

    const emailData = {
        from: process.env.SMTP_USERNAME,
        to: to,
        subject: subject,
        html: template(context),
    };
    console.log(emailData);
    transporter.sendMail(emailData, (error, info) =>{
        if (error){
            console.log('Error sending email:',error);
        }else {
            console.log('Email sent: ',info.response);
        }
    })
  
}
module.exports = {sendEmail};
