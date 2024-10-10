import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, FormControl, Select, InputLabel, Box, Typography, FormHelperText } from '@material-ui/core';
import Sidebar from '../../Components/sidebar';
import Header from '../../Components/navbar';
import axios from 'axios';
import swal from 'sweetalert';
import { useParams } from 'react-router-dom'; // To get the appointment ID from the URL

const UpdateAppointment = () => {
  const { id } = useParams(); // Get appointment ID from URL
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
    // Fetch the list of doctors from the API
    const fetchDoctors = async () => {
      try {
        const response = await axios.get('http://localhost:3002/doctors/get-doctors');
        setDoctorsList(response.data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    // Fetch the appointment details to populate the form
    const fetchAppointmentDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3002/appointment/get-appointment/${id}`);
        const appointment = response.data;

        setName(appointment.name);
        setAge(appointment.age);
        setContact(appointment.contact);
        setDoctor(appointment.doctor._id);
        setDate(appointment.date.substring(0, 10)); // Format the date for input
        setTime(appointment.time);
        setEmail(appointment.email);
      } catch (error) {
        console.error("Error fetching appointment:", error);
      }
    };

    fetchDoctors();
    fetchAppointmentDetails();
  }, [id]);

  const validateForm = () => {
    const newErrors = {};
    if (!name) newErrors.name = "Name is required.";
    if (!age) newErrors.age = "Age is required.";
    if (!contact) newErrors.contact = "Contact is required.";
    if (!doctor) newErrors.doctor = "Doctor is required.";
    if (!date) newErrors.date = "Date is required.";
    if (!time) newErrors.time = "Time is required.";
    if (!email) newErrors.email = "Email is required.";
    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const updatedAppointment = {
      name,
      age: Number(age),
      contact,
      doctor,
      date,
      time,
      email,
    };

    try {
      await axios.put(`http://localhost:3002/appointment/update-appointment/${id}`, updatedAppointment);
      swal("Success", "Appointment updated successfully!", "success");
      // Optionally, redirect or reset fields
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
          {/* Title Section */}
          <Box alignItems="center" justifyContent="center">
            <Typography variant="h4" gutterBottom style={{ fontFamily: 'cursive', fontWeight: 'bold', color: 'purple', textAlign: 'center', marginTop:'40px' }}>
              Update Appointment
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
                  onChange={(e) => setName(e.target.value)}
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
                  onChange={(e) => setAge(e.target.value)}
                  helperText={errors.age}
                  error={!!errors.age}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Contact"
                  variant="outlined"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  helperText={errors.contact}
                  error={!!errors.contact}
                />

                <FormControl fullWidth margin="normal" variant="outlined" error={!!errors.doctor}>
                <InputLabel>Doctor</InputLabel>
                <Select
                    value={doctor} // Ensure this is set to the doctor's ID from the appointment
                    onChange={(e) => setDoctor(e.target.value)}
                    label="Doctor"
                >
                    {doctorsList.map((doc) => (
                    <MenuItem key={doc._id} value={doc._id}>
                        {doc.doctorName}
                    </MenuItem>
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
                  onChange={(e) => setDate(e.target.value)}
                  helperText={errors.date}
                  error={!!errors.date}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Time"
                  variant="outlined"
                  type="time"
                  InputLabelProps={{ shrink: true }}
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
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
                  onChange={(e) => setEmail(e.target.value)}
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
                  Update Appointment
                </Button>
              </Box>
            </Box>

            {/* Image Section */}
            <Box
              style={{
                flex: 1,
                textAlign: 'center',
                padding: '20px',
                margin: '15px',
              }}
            >
              <img
                src="https://img.freepik.com/premium-photo/beautiful-female-doctor-explaining-medical-treatment-patient_358354-6412.jpg"
                alt="Update Appointment"
                style={{
                  width: '80%',
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

export default UpdateAppointment;
