import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, FormControl, Select, InputLabel, Box, Typography, FormHelperText } from '@material-ui/core';
import Sidebar from '../../Components/sidebar';
import axios from 'axios';
import swal from 'sweetalert';
import { format } from 'date-fns';

const MakeAppointment = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [contact, setContact] = useState('');
  const [doctor, setDoctor] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [email, setEmail] = useState('');
  const [doctorsList, setDoctorsList] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get('http://localhost:3002/doctors/get-doctors');
        setDoctorsList(response.data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctors();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    const contactPattern = /^\+94\s?[0-9]{9}$/; 
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name) newErrors.name = "Name is required.";
    if (!age || age <= 0 || age > 120) {
      newErrors.age = "Age must be a positive number and below 120.";
    }    
    if (!contact) {
      newErrors.contact = "Contact is required.";
    } else if (!contactPattern.test(`+94 ${contact}`)) { // Test with formatted input
      newErrors.contact = "Contact must be in the format: +94 9XXXXXXXX.";
    }
    if (!doctor) newErrors.doctor = "Doctor is required.";
    if (!date) newErrors.date = "Date is required.";
    if (!time) {
      newErrors.time = "Time is required.";
    } else {
      // Validate time to be between 4 PM (16:00) and 10 PM (22:00)
      const selectedTime = new Date(`1970-01-01T${time}:00`); // Use a fixed date for comparison
      const startTime = new Date('1970-01-01T16:00:00'); // 4 PM
      const endTime = new Date('1970-01-01T22:00:00'); // 10 PM
  
      if (selectedTime < startTime || selectedTime > endTime) {
        newErrors.time = "Time must be between 4 PM and 10 PM.";
      }
    }
    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!emailPattern.test(email)) {
      newErrors.email = "Email is not valid.";
    }
    return newErrors;
  };

  const handleInputChange = (setter, fieldName) => (event) => {
    setter(event.target.value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: undefined,
    }));
  };

  // Handle contact input to prepend +94 and restrict to 9 digits
  const handleContactChange = (event) => {
    const value = event.target.value;
    const digitsOnly = value.replace(/\D/g, '').slice(0, 9); // Allow only up to 9 digits after +94
    setContact(`+94 ${digitsOnly}`);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const newAppointment = {
      name,
      age: Number(age),
      contact,
      doctor,
      date,
      time,
      email,
    };

    try {
      await axios.post('http://localhost:3002/appointment/add-appointment', newAppointment);
      swal("Success", "Appointment made successfully!", "success");
      setName('');
      setAge('');
      setContact('');
      setDoctor('');
      setDate('');
      setTime('');
      setEmail('');
      setErrors({});
    } catch (error) {
      console.error(error);
      swal("Error", "Something went wrong. Please try again.", "error");
    }
  };

  // Get today's date in YYYY-MM-DD format for the min prop
  const today = format(new Date(), 'yyyy-MM-dd');

  return (
    <Box
      style={{
        backgroundImage: 'url(https://media.licdn.com/dms/image/v2/D4D12AQF-UNBK1Cd76A/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1692008950713?e=2147483647&v=beta&t=np9IYeph2hO3qky7DCqB0sM5KvXP3HWTBT5bknBBlnY)',
        backgroundSize: 'repeat', // Adjusts the background image size
        backgroundPosition: 'center', // Centers the image
        minHeight: 'auto', // Ensures it covers the full height
        padding: '20px', // Adds padding to the outer box
      }}
    >
      <Box display="flex" justifyContent="center">
        <Box
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          p={2}
          style={{ backgroundColor: 'white', borderRadius: 8, boxShadow: '0px 0px 10px rgba(0,0,0,0.1)', flex: 1, margin: '100px' }}
        >
          {/* Title Section */}
          <Box alignItems="center" justifyContent="center">
            <Typography variant="h4" gutterBottom style={{ fontFamily: 'cursive', fontWeight: 'bold', color: 'purple', textAlign: 'center', marginTop: '40px' }}>
              Make an Appointment
            </Typography>
          </Box>

          <Box display="flex" width="100%">
            {/* Form Section */}
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
                  label="Name"
                  variant="outlined"
                  value={name}
                  onChange={handleInputChange(setName, 'name')}
                  helperText={errors.name}
                  error={!!errors.name}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Age"
                  variant="outlined"
                  type="number"
                  value={age}
                  onChange={handleInputChange(setAge, 'age')}
                  helperText={errors.age}
                  error={!!errors.age}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Contact"
                  variant="outlined"
                  value={`+94 ${contact}`} 
                  onChange={(e) => {
                    const inputValue = e.target.value.replace('+94 ', ''); 
                    const digitsOnly = inputValue.replace(/\D/g, '').slice(0, 9); 
                    setContact(digitsOnly); 
                  }}
                  helperText={errors.contact}
                  error={!!errors.contact}
                  inputProps={{ maxLength: 13 }} 
                />
                <FormControl fullWidth margin="normal" variant="outlined" error={!!errors.doctor}>
                  <InputLabel>Doctor</InputLabel>
                  <Select
                    value={doctor}
                    onChange={handleInputChange(setDoctor, 'doctor')}
                    label="Doctor"
                  >
                    {doctorsList.map((doc) => (
                      <MenuItem key={doc._id} value={doc._id}>{doc.doctorName} - {doc.specialization}</MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{errors.doctor}</FormHelperText>
                </FormControl>
                <TextField
                    fullWidth
                    margin="normal"
                    label="Date"
                    variant="outlined"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={date}
                    onChange={handleInputChange(setDate, 'date')}
                    helperText={errors.date}
                    error={!!errors.date}
                    inputProps={{
                        min: today // Set minimum date to today
                    }}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Time"
                  variant="outlined"
                  type="time"
                  InputLabelProps={{ shrink: true }}
                  value={time}
                  onChange={handleInputChange(setTime, 'time')}
                  helperText={errors.time}
                  error={!!errors.time}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Email"
                  variant="outlined"
                  type="email"
                  value={email}
                  onChange={handleInputChange(setEmail, 'email')}
                  helperText={errors.email}
                  error={!!errors.email}
                />
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  type="submit"
                  style={{ marginTop: 16 }}
                >
                  Make Appointment
                </Button>
              </Box>
            </Box>

            {/* Image Section */}
            <Box
              style={{
                flex: 1,
                textAlign: 'center',
                padding: '20px',
                margin: '5px',
              }}
            >
              <img
                src="https://img.freepik.com/premium-photo/beautiful-female-doctor-explaining-medical-treatment-patient_358354-6412.jpg"
                alt="Appointment"
                style={{
                  width: '85%',
                  height: 'auto',
                  borderRadius: '10px',
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MakeAppointment;
