const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticket.controller');

// Create a new ticket
router.post('/', ticketController.createTicket);

// Get all tickets
router.get('/', ticketController.getAllTickets);

// Get a ticket by ID
router.get('/:id', ticketController.getTicketById);

// Update a ticket by ID
router.put('/:id', ticketController.updateTicket);

// Delete a ticket by ID
router.delete('/:id', ticketController.deleteTicket);

// Search tickets
router.get('/tickets/search', ticketController.searchTickets);

module.exports = router;
