import React, { useState } from 'react';
import { TextField, Button, Box, Typography, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@material-ui/core';
import Sidebar from '../../Components/sidebar';
import axios from 'axios';
import swal from 'sweetalert';

const AddDoctor = () => {
  const [doctorName, setDoctorName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [availableFrom, setAvailableFrom] = useState('');
  const [availableTo, setAvailableTo] = useState('');
  const [errors, setErrors] = useState({});

  const handleDoctorNameChange = (event) => {
    setDoctorName(event.target.value);
    setErrors(prevErrors => ({ ...prevErrors, doctorName: '' }));
  };

  const handleSpecializationChange = (event) => {
    setSpecialization(event.target.value);
    setErrors(prevErrors => ({ ...prevErrors, specialization: '' }));
  };

  const handleContactNumberChange = (event) => {
    const { value } = event.target;

    // Use a regular expression to allow only digits
    const numericValue = value.replace(/[^0-9]/g, '');

    // Limit the numericValue to a maximum of 10 characters
    if (numericValue.length <= 10) {
        // Update the state with the numeric value
        setContactNumber(numericValue);
    }
    setErrors(prevErrors => ({ ...prevErrors, contactNumber: '' }));
  };

  const handleAvailableFromChange = (event) => {
    setAvailableFrom(event.target.value);
    setErrors(prevErrors => ({ ...prevErrors, availableFrom: '' }));
  };

  const handleAvailableToChange = (event) => {
    setAvailableTo(event.target.value);
    setErrors(prevErrors => ({ ...prevErrors, availableTo: '' }));
  };

  const specializationsList = [
    'Cardiology',
    'Dermatology',
    'Neurology',
    'Pediatrics',
    'Psychiatry',
    'Surgery',
    'Gynecology',
    'Orthopedics',
    'Ophthalmology',
    'Radiology'
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!doctorName) newErrors.doctorName = "Doctor Name is required.";
    if (!specialization) newErrors.specialization = "Specialization is required.";
    if (!contactNumber) {
      newErrors.contactNumber = "Contact Number is required.";
    } else if (!/^\d{10}$/.test(contactNumber)) {
      newErrors.contactNumber = "Contact Number must be 10 digits.";
    }
    if (!availableFrom) newErrors.availableFrom = "Available From time is required.";
    if (!availableTo) newErrors.availableTo = "Available To time is required.";
    return newErrors;
  };
  

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const newDoctor = {
      doctorName,
      specialization,
      contactNumber,
      availableHours: `${availableFrom} - ${availableTo}`,
    };

    try {
      await axios.post('http://localhost:3002/doctors/add-doctor', newDoctor);
      swal("Success", "New doctor added successfully!", "success");
      setDoctorName('');
      setSpecialization('');
      setContactNumber('');
      setAvailableFrom('');
      setAvailableTo('');
      setErrors({});
    } catch (error) {
      console.error(error);
      swal("Error", "Something went wrong. Please try again.", "error");
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

          <Box component="form" width="100%" noValidate autoComplete="off" onSubmit={handleSubmit}>
            <Box display="flex" alignItems="center" marginLeft={'40px'}>
                <Box flexGrow={1}>

                {/* Title Section */}
                <Box alignItems="center" justifyContent="center">
                    <Typography variant="h4" gutterBottom style={{ fontFamily: 'cursive', fontWeight: 'bold', color: 'purple', textAlign: 'center', marginTop:'40px' }}>
                    Add New Doctor
                    </Typography>
                </Box>

                <TextField
                    fullWidth
                    margin="normal"
                    label="Doctor Name"
                    variant="outlined"
                    value={doctorName}
                    onChange={handleDoctorNameChange}
                    helperText={errors.doctorName}
                    error={!!errors.doctorName}
                />
                <FormControl fullWidth margin="normal" variant="outlined" error={!!errors.specialization}>
                    <InputLabel>Specialization</InputLabel>
                    <Select
                    value={specialization}
                    onChange={handleSpecializationChange}
                    label="Specialization"
                    >
                    <MenuItem value="Cardiology">Cardiology</MenuItem>
                    <MenuItem value="Dermatology">Dermatology</MenuItem>
                    <MenuItem value="Pediatrics">Pediatrics</MenuItem>
                    <MenuItem value="Neurology">Neurology</MenuItem>
                    <MenuItem value="Orthopedics">Orthopedics</MenuItem>
                    </Select>
                    <FormHelperText>{errors.specialization}</FormHelperText>
                </FormControl>
                <TextField
                    fullWidth
                    margin="normal"
                    label="Contact Number"
                    variant="outlined"
                    value={contactNumber}
                    onChange={handleContactNumberChange}
                    helperText={errors.contactNumber}
                    error={!!errors.contactNumber}
                />
                <FormControl fullWidth margin="normal" variant="outlined" error={!!errors.availableFrom}>
                    <InputLabel>Available From</InputLabel>
                    <Select
                    value={availableFrom}
                    onChange={handleAvailableFromChange}
                    label="Available From"
                    >
                    {Array.from({ length: 24 }, (_, i) => (
                        <MenuItem key={i} value={`${i}:00`}>{`${i}:00`}</MenuItem>
                    ))}
                    </Select>
                    <FormHelperText>{errors.availableFrom}</FormHelperText>
                </FormControl>
                <FormControl fullWidth margin="normal" variant="outlined" error={!!errors.availableTo}>
                    <InputLabel>Available To</InputLabel>
                    <Select
                    value={availableTo}
                    onChange={handleAvailableToChange}
                    label="Available To"
                    >
                    {Array.from({ length: 24 }, (_, i) => (
                        <MenuItem key={i} value={`${i}:00`}>{`${i}:00`}</MenuItem>
                    ))}
                    </Select>
                    <FormHelperText>{errors.availableTo}</FormHelperText>
                </FormControl>
                <Button
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                type="submit"
                style={{ marginTop: 16 }}
                >
                Add Doctor
                </Button>
                </Box>
                <img src="https://thumbs.dreamstime.com/b/portrait-indian-female-doctor-22957558.jpg" alt="Doctor" style={{ marginLeft: '40px', height: '450px', width: 'auto', marginTop:'80px' }} />
            </Box>

            </Box>

        </Box>
      </Box>
    </Box>
  );
};

export default AddDoctor;
