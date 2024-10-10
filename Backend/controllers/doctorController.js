// controllers/doctorController.js
const Doctor = require("../models/doctorModel");
const mongoose = require('mongoose'); // Import mongoose for ObjectId validation

// Add a new doctor
exports.addNewDoctor = async (req, res) => {
    try {
        const { doctorName, specialization, contactNumber, availableHours } = req.body;

        // Log the received data for debugging
        console.log(req.body);

        // Create an array to hold error messages for missing fields
        const missingFields = [];

        // Check each field and push to missingFields array if not provided
        if (!doctorName) missingFields.push("doctorName");
        if (!specialization) missingFields.push("specialization");
        if (!contactNumber) missingFields.push("contactNumber");
        if (!availableHours) missingFields.push("availableHours");

        // If there are any missing fields, return a detailed message
        if (missingFields.length > 0) {
            return res.status(400).json({ 
                message: "The following fields are required", 
                missingFields 
            });
        }

        const newDoctor = new Doctor({
            doctorName,
            specialization,
            contactNumber,
            availableHours
        });

        await newDoctor.save();
        res.status(201).json({ message: "New doctor added successfully!" });
    } catch (err) {
        console.error(err); // Log error for debugging
        res.status(500).json({ message: err.message });
    }
};

// Delete a doctor
exports.deleteDoctor = (req, res) => {
    const doctorId = req.params.id;

    // Validate the doctor ID
    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
        return res.status(400).send({ message: "Invalid doctor ID" });
    }

    Doctor.deleteOne({ _id: doctorId })
        .then(() => {
            res.status(200).send({ status: "Doctor deleted successfully" });
        })
        .catch((err) => {
            console.error(err.message);
            res.status(500).send({ status: "Error with deleting doctor", error: err.message });
        });
};

// Get all doctors
exports.getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find();
        res.json(doctors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a single doctor by ID
exports.getDoctorById = async (req, res) => {
    const { id } = req.params;

    // Validate the doctor ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({ message: "Invalid doctor ID" });
    }

    try {
        const doctor = await Doctor.findById(id);
        if (!doctor) return res.status(404).json({ message: "Doctor not found!" });
        res.json(doctor);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update a doctor's details
exports.updateDoctor = async (req, res) => {
    const doctorId = req.params.id;
    const { doctorName, specialization, contactNumber, availableHours } = req.body;

    // Validate inputs
    if (!(doctorName && specialization && contactNumber && availableHours)) {
        return res.status(400).send({ message: "All inputs are required" });
    }

    // Validate the doctor ID
    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
        return res.status(400).send({ message: "Invalid doctor ID" });
    }

    try {
        // Check if the doctor exists in the database
        const isDoctor = await Doctor.findById(doctorId);

        if (!isDoctor) {
            return res.status(404).json({ message: "Doctor not found!" });
        }

        // Update the doctor's details
        const result = await Doctor.updateOne(
            { _id: doctorId },
            {
                doctorName,
                specialization,
                contactNumber,
                availableHours
            }
        );

        if (result.modifiedCount === 0) {
            return res.status(400).json({ message: "No changes were made" });
        }

        return res.status(200).json({ message: "Doctor updated successfully!" });
    } catch (err) {
        console.error(err); // Log the error for debugging
        return res.status(500).json({ message: err.message });
    }
};

// Get specialization counts
exports.getSpecializationCounts = async (req, res) => {
    try {
        // Aggregate the count of doctors by specialization
        const specializationCounts = await Doctor.aggregate([
            {
                $group: {
                    _id: "$specialization",
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    specialization: "$_id",
                    count: 1
                }
            }
        ]);

        // If no counts found, return an empty object
        if (!specializationCounts.length) {
            return res.json({ message: "No specializations found" });
        }

        res.json(specializationCounts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
