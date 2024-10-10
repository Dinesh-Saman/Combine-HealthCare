import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, TextField, Button, Box, MenuItem, Select, InputLabel } from '@material-ui/core';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import RegisterImage from '../../Images/health1.png';

const ManageProfileForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {id} = useParams();
  const { username, email } = location.state || {}; 

  const [formData, setFormData] = useState({
    title: '',
    firstName: '',
    lastName: '',
    address: '',
    NIC: '',
    DOB: '',
    contact: '+94 ',
    emailAddress: '',
    city: '',
    district: '',
  });

  const [errors, setErrors] = useState({});
  const districts = [
    'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya', 'Galle', 'Matara', 'Hambantota',
    'Jaffna', 'Kilinochchi', 'Mannar', 'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
    'Polonnaruwa', 'Anuradhapura', 'Kurunegala', 'Ratnapura', 'Kegalle', 'Badulla', 'Monaragala', 'Puttalam'
  ];

  // Fetch existing user details when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:3002/user/user/${id}`);
        setFormData(response.data); 

      } catch (error) {
        console.error(error);
      }
    };

    fetchUserData();
  }, [username]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
  
    // Check for required fields
    if (!formData.firstName) newErrors.firstName = "First Name is required.";
    if (!formData.lastName) newErrors.lastName = "Last Name is required.";
    if (!formData.address) newErrors.address = "Address is required.";
    if (!formData.NIC) newErrors.NIC = "NIC is required.";
    if (!formData.contact) newErrors.contact = "Contact number is required.";
    if (!formData.emailAddress) newErrors.emailAddress = "Email Address is required.";
    if (!formData.city) newErrors.city = "City is required.";
    if (!formData.district) newErrors.district = "District is required.";
  
    // Validate Email Format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.emailAddress && !emailPattern.test(formData.emailAddress)) {
      newErrors.emailAddress = "Email Address is not valid.";
    }
  
    // Validate NIC Format
    const nicPattern = /^\d{9}[Vv]$|^\d{12}$/;
    if (formData.NIC && !nicPattern.test(formData.NIC)) {
      newErrors.NIC = "NIC must be in format 992483040V or 992483040.";
    }
  
    // Validate Contact Number Format
    const contactPattern = /^\+94 \d{9}$/;
    if (formData.contact && !contactPattern.test(formData.contact)) {
      newErrors.contact = "Contact number must start with +94 followed by 9 digits.";
    }
  
    // Validate Date of Birth for age (minimum 18 years)
    if (formData.DOB) {
      const dob = new Date(formData.DOB);
      const age = new Date().getFullYear() - dob.getFullYear();
      if (age < 18) {
        newErrors.DOB = "You must be at least 18 years old.";
      }
    }
  
    return newErrors;
  };
  

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateForm();

    console.log(Object.keys(validationErrors).length);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      console.log(validationErrors);
      return;
    }

    try {
      await axios.put(`http://localhost:3002/user/user/${id}`, formData); // Update user profile

      Swal.fire('Success', 'Profile updated successfully!', 'success');
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Failed to update profile', 'error');
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      style={{
        backgroundImage: 'url("https://img.freepik.com/free-vector/black-floral-seamless-pattern-with-shadow_1284-42217.jpg")',
        backgroundSize: 'auto',
      }}
    >
      <Box
        display="flex"
        flexDirection="row"
        width="80%"
        p={2}
        mt={3}
        mb={3}
        borderRadius={8}
        boxShadow="0px 0px 10px rgba(0,0,0,0.1)"
        style={{ backgroundColor: 'white' }}
      >
        <Box flex={2} pr={4}>
          <Typography
            variant="h4"
            gutterBottom
            style={{ fontFamily: 'cursive', fontWeight: 'bold', color: 'purple', textAlign: 'center', marginTop: '40px' }}
          >
            Manage Profile
          </Typography>

          <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit} style={{ marginLeft: '40px' }}>
            {/* Form Fields */}
            <InputLabel>Title</InputLabel>
            <Select
              fullWidth
              label="title"
              name='title'
              value={formData.title}
              onChange={handleChange}
              variant="outlined"
              margin="normal"
            >
              {['Mr', 'Mrs', 'Miss', 'Dr', 'Prof'].map((title) => (
                <MenuItem key={title} value={title}>
                  {title}
                </MenuItem>
              ))}
            </Select>

            <TextField
              fullWidth
              margin="normal"
              label="First Name"
              name="firstName"
              variant="outlined"
              value={formData.firstName}
              onChange={handleChange}
              helperText={errors.firstName}
              error={!!errors.firstName}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Last Name"
              name="lastName"
              variant="outlined"
              value={formData.lastName}
              onChange={handleChange}
              helperText={errors.lastName}
              error={!!errors.lastName}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Address"
              name="address"
              variant="outlined"
              value={formData.address}
              onChange={handleChange}
              helperText={errors.address}
              error={!!errors.address}
            />

            <TextField
              fullWidth
              margin="normal"
              label="NIC"
              name="NIC"
              variant="outlined"
              value={formData.NIC}
              onChange={handleChange}
              helperText={errors.NIC}
              error={!!errors.NIC}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Date of Birth"
              name="DOB"
              type="date"
              variant="outlined"
              value={formData.DOB.substring(0,10)}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              helperText={errors.DOB}
              error={!!errors.DOB}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Contact"
              name="contact"
              variant="outlined"
              value={formData.contact}
              onChange={handleChange}
              helperText={errors.contact}
              error={!!errors.contact}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Email Address"
              name="emailAddress"
              variant="outlined"
              value={formData.emailAddress}
              onChange={handleChange}
              helperText={errors.emailAddress}
              error={!!errors.emailAddress}
            />

            <TextField
              fullWidth
              margin="normal"
              label="City"
              name="city"
              variant="outlined"
              value={formData.city}
              onChange={handleChange}
              helperText={errors.city}
              error={!!errors.city}
            />

            <TextField
              fullWidth
              select
              margin="normal"
              label="District"
              name="district"
              variant="outlined"
              value={formData.district}
              onChange={handleChange}
              helperText={errors.district}
              error={!!errors.district}
            >
              {districts.map((district, index) => (
                <MenuItem key={index} value={district}>
                  {district}
                </MenuItem>
              ))}
            </TextField>

            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              style={{ marginTop: '16px' }}
            >
              Update Profile
            </Button>

            <Box mt={2} textAlign="center">
                <Typography variant="body2">
                    Want to go back?{' '}
                    <Link to="/" style={{ color: 'blue', textDecoration: 'none' }}>
                        Home
                    </Link>
                </Typography>
            </Box>
          </Box>
        </Box>
        {/* Image Section */}
        <Box flex={1} display="flex" justifyContent="center" alignItems="center">
            <img
              src={RegisterImage}
              alt="Register"
              style={{
                maxWidth: '18%',
                height: 'auto',
                position: 'absolute',
                top: '240px',         
                left: '900px',        
              }}
            />
          </Box>
      </Box>
    </Box>
  );
};

export default ManageProfileForm;
