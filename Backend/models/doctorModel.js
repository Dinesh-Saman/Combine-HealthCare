// models/doctorModel.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const doctorSchema = new Schema({
  doctorName: {
    type: String,
    required: true,
  },
  specialization: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  availableHours: {
    type: String, // Example format: "9:00 AM - 5:00 PM"
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);
