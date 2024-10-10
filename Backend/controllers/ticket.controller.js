const Ticket = require('../models/ticketModel');

// Create a new ticket
exports.createTicket = async (req, res) => {
  try {
    const { email, issueTitle, issueDescription, priority } = req.body;

    // Validate required fields
    if (!email || !issueTitle || !issueDescription || !priority) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Create a new ticket instance
    const newTicket = new Ticket({
      email,
      issueTitle,
      issueDescription,
      priority
    });

    // Save the ticket to the database
    const savedTicket = await newTicket.save();
    res.status(201).json({ message: 'Ticket created successfully', ticket: savedTicket });
  } catch (error) {
    console.error("Error creating ticket:", error);
    res.status(500).json({ message: 'Error creating ticket', error });
  }
};

// Get all tickets
exports.getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find();
    res.status(200).json(tickets);
  } catch (error) {
    console.error("Error retrieving tickets:", error);
    res.status(500).json({ message: 'Error retrieving tickets', error });
  }
};

// Get a single ticket by ID
exports.getTicketById = async (req, res) => {
    const ticketId = req.params.id;
  
    // Check if ticket ID is provided
    if (!ticketId) {
      return res.status(400).json({ message: 'Ticket ID is required' });
    }
  
    try {
      const ticket = await Ticket.findById(ticketId);
      if (!ticket) {
        return res.status(404).json({ message: 'Ticket not found' });
      }
      res.status(200).json(ticket);
    } catch (error) {
      console.error("Error retrieving ticket:", error);
      res.status(500).json({ message: 'Error retrieving ticket', error });
    }
  };
  

// Update a ticket by ID
exports.updateTicket = async (req, res) => {
  try {
    const { issueTitle, issueDescription, priority, status } = req.body;

    // Validate required fields
    if (!issueTitle || !issueDescription || !priority || !status) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const updatedTicket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { issueTitle, issueDescription, priority, status, updatedDate: Date.now() },
      { new: true }
    );

    if (!updatedTicket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.status(200).json({ message: 'Ticket updated successfully', ticket: updatedTicket });
  } catch (error) {
    console.error("Error updating ticket:", error);
    res.status(500).json({ message: 'Error updating ticket', error });
  }
};

// Delete a ticket by ID
exports.deleteTicket = async (req, res) => {
  try {
    const deletedTicket = await Ticket.findByIdAndDelete(req.params.id);
    if (!deletedTicket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    res.status(200).json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    console.error("Error deleting ticket:", error);
    res.status(500).json({ message: 'Error deleting ticket', error });
  }
};

// Search tickets by title, description, status, or priority
exports.searchTickets = async (req, res) => {
  try {
    const query = req.query.q;
    const searchQuery = {
      $or: [
        { issueTitle: new RegExp(query, 'i') },
        { issueDescription: new RegExp(query, 'i') },
        { status: new RegExp(query, 'i') },
        { priority: new RegExp(query, 'i') }
      ]
    };

    const tickets = await Ticket.find(searchQuery);
    res.status(200).json(tickets);
  } catch (error) {
    console.error("Error searching tickets:", error);
    res.status(500).json({ message: 'Error searching tickets', error });
  }
};
