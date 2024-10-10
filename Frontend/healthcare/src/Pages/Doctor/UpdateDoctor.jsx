import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, FormControl, Select, InputLabel, Box, Typography, FormHelperText } from '@material-ui/core';
import Sidebar from '../../Components/sidebar';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import swal from 'sweetalert';

const UpdateDoctor = () => {
  const { id } = useParams(); // Extract doctor ID from URL params
  const navigate = useNavigate();

  const [doctorId, setDoctorId] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [availableFrom, setAvailableFrom] = useState('');
  const [availableTo, setAvailableTo] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchDoctor = async () => {
        try {
            const response = await axios.get(`http://localhost:3002/doctors/get-doctor/${id}`);
            const { doctorName, specialization, contactNumber, availableHours } = response.data;

            setDoctorId(id.substring(0, 5)); 
            setDoctorName(doctorName);
            setSpecialization(specialization);
            setContactNumber(contactNumber);
            
            if (availableHours) {
                const [from, to] = availableHours.split(' - ');
                // Format times to ensure they are in "HH:mm"
                setAvailableFrom(from.trim().padStart(5, '0')); // Adds leading zeros
                setAvailableTo(to.trim().padStart(5, '0')); // Adds leading zeros
            }
            
        } catch (error) {
            console.error(error);
            swal("Error", "Failed to fetch doctor data.", "error");
        }
    };

    fetchDoctor();
}, [id]);



const validateForm = () => {
    const newErrors = {};
    
    // Required field validations
    if (!doctorId) newErrors.doctorId = "Doctor ID is required.";
    if (!doctorName) newErrors.doctorName = "Doctor Name is required.";
    if (!specialization) newErrors.specialization = "Specialization is required.";
    
    // Contact number validation
    if (!contactNumber) {
        newErrors.contactNumber = "Contact number is required.";
    } else if (contactNumber.length > 10) {
        newErrors.contactNumber = "Contact number must not exceed 10 digits.";
    } else if (!/^\d{10}$/.test(contactNumber)) {
        newErrors.contactNumber = "Contact number must be a valid 10-digit number.";
    }
    
    // Available time validations
    if (!availableFrom) newErrors.availableFrom = "Available From time is required.";
    if (!availableTo) newErrors.availableTo = "Available To time is required.";
    
    return newErrors;
};


const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

    const doctorData = {
        doctorId, // your existing doctor ID logic
        doctorName,
        specialization,
        contactNumber,
        availableHours: `${availableFrom} - ${availableTo}`, // Combine availableFrom and availableTo
    };

    try {
        const response = await axios.put(`http://localhost:3002/doctors/update-doctor/${id}`, doctorData);
        swal("Success", "Doctor information updated successfully!", "success");
    } catch (error) {
        console.error(error);
        swal("Error", "Failed to update doctor data.", "error");
    }
};


const handlePhoneChange = (event) => {
    const { value } = event.target;

    // Use a regular expression to allow only digits
    const numericValue = value.replace(/[^0-9]/g, '');

    // Limit the numericValue to a maximum of 10 characters
    if (numericValue.length <= 10) {
        // Update the state with the numeric value
        setContactNumber(numericValue);
    }
};



  return (
    <Box>
      <Box display="flex">
        <Sidebar />
        <Box
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          p={2}
          style={{ backgroundColor: 'white', borderRadius: 8, boxShadow: '0px 0px 10px rgba(0,0,0,0.1)', flex: 1, margin: '15px' }}
        >
          <Box alignItems="center" justifyContent="center">
            <Typography variant="h4" gutterBottom style={{ fontFamily: 'cursive', fontWeight: 'bold', color: 'purple', textAlign: 'center', marginTop:'40px' }}>
              Update Doctor Details
            </Typography>
          </Box>

          <Box display="flex" width="100%">
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              style={{ flex: 1, padding: '20px', margin: '15px' }}
            >
              <Box component="form" width="100%" noValidate autoComplete="off" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Doctor ID"
                  variant="outlined"
                  value={doctorId} // Display the first 5 characters
                  onChange={(e) => setDoctorId(e.target.value)}
                  helperText={errors.doctorId}
                  error={!!errors.doctorId}
                  disabled
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Doctor Name"
                  variant="outlined"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  helperText={errors.doctorName}
                  error={!!errors.doctorName}
                />
                <FormControl fullWidth margin="normal" variant="outlined" error={!!errors.specialization}>
                    <InputLabel>Specialization</InputLabel>
                    <Select
                        value={specialization}
                        onChange={(e) => setSpecialization(e.target.value)}
                        label="Specialization"
                    >
                        <MenuItem value="Cardiology">Cardiology</MenuItem>
                        <MenuItem value="Neurology">Neurology</MenuItem>
                        <MenuItem value="Pediatrics">Pediatrics</MenuItem>
                        <MenuItem value="Orthopedics">Orthopedics</MenuItem>
                        <MenuItem value="Dermatology">Dermatology</MenuItem>
                    </Select>
                    <FormHelperText>{errors.specialization}</FormHelperText>
                </FormControl>
                <TextField
                    fullWidth
                    margin="normal"
                    label="Contact Number"
                    variant="outlined"
                    value={contactNumber}
                    onChange={handlePhoneChange} // Updated here
                    helperText={errors.contactNumber}
                    error={!!errors.contactNumber}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Available From"
                  variant="outlined"
                  type="time"
                  value={availableFrom}
                  onChange={(e) => setAvailableFrom(e.target.value)}
                  helperText={errors.availableFrom}
                  error={!!errors.availableFrom}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Available To"
                  variant="outlined"
                  type="time"
                  value={availableTo}
                  onChange={(e) => setAvailableTo(e.target.value)}
                  helperText={errors.availableTo}
                  error={!!errors.availableTo}
                />
                <Button type="submit" variant="contained" color="primary" style={{ marginTop: 20 }}>
                  Update Doctor Details
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default UpdateDoctor;
