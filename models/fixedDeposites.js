const mongoose = require('mongoose');

const fixedDepositeSchema = new mongoose.Schema({
    Accountnumber: { type: Number },
    name: { type: String },
    DueDate: { type: Date},
    declerentname: { type: String },
    addressline1: { type: String },
    addressline2: { type: String },
    city: { type: String },
    state:{type:String},
    pincode: { type: Number },
    mobilenumber: { type: Number },
    telephone:{type:Number},
    email: { type: String },  
    fathername:{type:String},
    nominee: { type: String },
   
    fixeddeposite:{type:String},

});

const FixedDeposites = mongoose.model('FixedDeposites', fixedDepositeSchema);



module.exports = FixedDeposites;