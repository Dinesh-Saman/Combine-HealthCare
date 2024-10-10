// routes/appointment.js
const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

// Add a new appointment
router.post('/add-appointment/', appointmentController.addNewAppointment);

// Delete an appointment
router.delete('/delete-appointment/:id', appointmentController.deleteAppointment);

// Get all appointments
router.get('/get-appointments/', appointmentController.getAllAppointments);

// Get a single appointment by ID
router.get('/get-appointment/:id', appointmentController.getAppointmentById);

// Update an appointment
router.put('/update-appointment/:id', appointmentController.updateAppointment);

module.exports = router;
