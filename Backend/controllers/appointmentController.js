// controllers/appointmentController.js
const Appointment = require("../models/appointmentModel");
const mongoose = require('mongoose'); // Import mongoose for ObjectId validation
const nodemailer = require('nodemailer');
const sendEmail = require('../services/emailService');

// Add a new appointment
exports.addNewAppointment = async (req, res) => {
    try {
        const { name, age, contact, doctor, date, time, email } = req.body;

        // Log the received data for debugging
        console.log(req.body);

        // Check for missing fields
        const missingFields = [];
        if (!name) missingFields.push("name");
        if (!age) missingFields.push("age");
        if (!contact) missingFields.push("contact");
        if (!doctor) missingFields.push("doctor");
        if (!date) missingFields.push("date");
        if (!time) missingFields.push("time");
        if (!email) missingFields.push("email");

        if (missingFields.length > 0) {
            return res.status(400).json({ 
                message: "The following fields are required", 
                missingFields 
            });
        }

        // Check if doctor is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(doctor)) {
            return res.status(400).send({ message: "Invalid doctor ID" });
        }

        const newAppointment = new Appointment({
            name,
            age,
            contact,
            doctor,
            date,
            time,
            email
        });

        // Save the new appointment
        const savedAppointment = await newAppointment.save();
        console.log(savedAppointment);

        // Populate doctor's name
        const populatedAppointment = await Appointment.findById(savedAppointment._id).populate('doctor');

        // Extract doctor's name
        const doctorName = populatedAppointment.doctor ? populatedAppointment.doctor.doctorName : 'Doctor'; // Adjust this field according to your doctor model

        // Send confirmation email
        const transporter = nodemailer.createTransport({
            service: 'Gmail', // Change this to your email provider
            auth: {
                user: process.env.EMAIL, // Your email address from .env
                pass: process.env.EMAIL_PASSWORD // Your email password or app password from .env
            }
        });

        const mailOptions = {
            from: process.env.EMAIL, // Your defined email address
            to: email, // Recipient's email address
            subject: 'Appointment Confirmation',
            text: `Hello ${name},\n\nYour appointment has been successfully scheduled with Dr. ${doctorName} on ${date} at ${time}.\n\nThank you!`
        };

        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ message: 'Appointment created but email not sent.' });
            }
            console.log('Email sent:', info.response);
        });

        res.status(201).json({ message: "New appointment added successfully!" });
    } catch (err) {
        console.error(err); // Log error for debugging
        res.status(500).json({ message: err.message });
    }
};


// Delete an appointment
exports.deleteAppointment = (req, res) => {
    const appointmentId = req.params.id;

    Appointment.deleteOne({ _id: appointmentId })
        .then(() => {
            res.status(200).send({ status: "Appointment deleted" });
        })
        .catch((err) => {
            console.error(err.message);
            res.status(500).send({ status: "Error with deleting appointment", error: err.message });
        });
};

// Get all appointments
exports.getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find().populate('doctor');
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a single appointment by ID
exports.getAppointmentById = async (req, res) => {
    const { id } = req.params;

    try {
        const appointment = await Appointment.findById(id).populate('doctor');
        if (!appointment) return res.status(404).json({ message: "Appointment not found!" });
        res.json(appointment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update an appointment
exports.updateAppointment = async (req, res) => {
    const appointmentId = req.params.id;
    const { name, age, contact, doctor, date, time, email } = req.body;

    // Validate inputs
    if (!(name && age && contact && doctor && date && time && email)) {
        return res.status(400).send({ message: "All inputs are required" });
    }

    // Check if appointmentId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
        return res.status(400).send({ message: "Invalid appointment ID" });
    }

    try {
        // Check if the appointment exists in the database
        const isAppointment = await Appointment.findById(appointmentId);

        if (!isAppointment) {
            return res.status(404).json({ message: "Appointment not found!" });
        }

        // Update the appointment
        const result = await Appointment.updateOne(
            { _id: appointmentId },
            {
                name,
                age,
                contact,
                doctor,
                date,
                time,
                email,
            }
        );

        if (result.modifiedCount === 0) {
            return res.status(400).json({ message: "No changes were made" });
        }

        return res.status(200).json({ message: "Appointment updated successfully!" });
    } catch (err) {
        console.error(err); // Log the error for debugging
        return res.status(500).json({ message: err.message });
    }
};

