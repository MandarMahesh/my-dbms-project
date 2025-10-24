const mongoose = require('mongoose');


const PatientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number },
    gender: { type: String },
    phone: { type: String },
    doctor: { type: String, required: true },
    notes: { type: String }
}, { timestamps: true });


module.exports = mongoose.model('Patient', PatientSchema);