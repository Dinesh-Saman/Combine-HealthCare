const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  issueTitle: {
    type: String,
    required: true,
    maxlength: 100
  },
  issueDescription: {
    type: String,
    required: true,
    maxlength: 500
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
    default: 'Open'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  createdDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Ticket', ticketSchema);