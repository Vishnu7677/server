const mongoose = require('mongoose');

const applicantSchema = new mongoose.Schema({
    vehicleRegNum: { type: String, required: true },
    vehicleMake: { type: String, required: true },
    vehicleModel: { type: String, required: true },

    customerDetails: { type: mongoose.Schema.Types.ObjectId, ref: 'UserDetailsAccounts' },
    
})

const Applicants = mongoose.model('applicant', applicantSchema);

module.exports = Applicants;