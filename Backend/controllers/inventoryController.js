const Inventory = require('../models/inventoryModel');
const nodemailer = require('nodemailer');

// Create a new inventory item
exports.createInventoryItem = async (req, res) => {
  try {
    const newItem = new Inventory(req.body);
    const savedItem = await newItem.save();
    res.status(201).json({ message: 'Item added successfully', item: savedItem });
  } catch (error) {
    res.status(500).json({ message: 'Error adding item', error });
  }
};

// Get all inventory items
exports.getAllInventoryItems = async (req, res) => {
  try {
    const items = await Inventory.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving items', error });
  }
};

// Fetch an inventory item by ID
exports.getInventoryItemById = async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving item', error });
  }
};

// Update an inventory item
exports.updateInventoryItem = async (req, res) => {
  try {
    const updatedItem = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json({ message: 'Item updated successfully', item: updatedItem });
  } catch (error) {
    res.status(500).json({ message: 'Error updating item', error });
  }
};

// Delete an inventory item
exports.deleteInventoryItem = async (req, res) => {
  try {
    const deletedItem = await Inventory.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting item', error });
  }
};

// Generate stock report
exports.generateStockReport = async (req, res) => {
  try {
    const items = await Inventory.find();
    // Implement report generation logic if needed
    res.status(200).json({ message: 'Stock report generated', items });
  } catch (error) {
    res.status(500).json({ message: 'Error generating report', error });
  }
};

// Send email when an item is out of stock
const sendEmail = (item) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'samanworldcafe@gmail.com',
      pass: 'vwgx hjuj behy bbxc',
    },
  });

  const mailOptions = {
    from: 'samanworldcafe@gmail.com',
    to: 'samanworldcafe@gmail.com',
    subject: 'Out of Stock Alert',
    text: `The item ${item.itemName} is out of stock.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

// Check stock and send email if necessary
exports.checkStockAndNotify = async (req, res) => {
  try {
    const items = await Inventory.find();
    items.forEach((item) => {
      if (item.quantity === 0) {
        sendEmail(item);
      }
    });
    res.status(200).json({ message: 'Stock checked and notifications sent if needed' });
  } catch (error) {
    res.status(500).json({ message: 'Error checking stock', error });
  }
};
