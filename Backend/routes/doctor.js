// routes/doctor.js
const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');

// Add a new doctor
router.post('/add-doctor/', doctorController.addNewDoctor);

// Delete a doctor
router.delete('/delete-doctor/:id', doctorController.deleteDoctor);

// Get all doctors
router.get('/get-doctors/', doctorController.getAllDoctors);

// Get a single doctor by ID
router.get('/get-doctor/:id', doctorController.getDoctorById);

// Update a doctor
router.put('/update-doctor/:id', doctorController.updateDoctor);

module.exports = router;
