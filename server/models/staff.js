const mongoose = require('mongoose');

const schema = mongoose.Schema({
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true, trim: true },
    firstname: { type: String, required: true, trim: true },
    lastname: { type: String, required: true, trim: true },
    role: { type: String, default: "staff" }
},{
    collection: 'staffs',
    timestamps: true 
});

const staff = mongoose.model('Staff', schema);
module.exports = staff;