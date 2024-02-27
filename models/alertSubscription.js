const mongoose = require('mongoose');

const SubscriptionAlert = new mongoose.Schema({

  CreditCardNumber: String,
  emailAddress: String,
  MobileNumber: String,
  subscriptionStatus: String,

})
const AlertSubscription = mongoose.model(' AlertSubscription', SubscriptionAlert);

module.exports = AlertSubscription;