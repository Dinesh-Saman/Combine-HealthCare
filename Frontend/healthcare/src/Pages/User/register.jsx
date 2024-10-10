import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, TextField, Button, Box, MenuItem,  Select, InputLabel  } from '@material-ui/core';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';
import RegisterImage from '../../Images/health.png';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    title: 'Mr',
    firstName: '',
    lastName: '',
    address: '',
    NIC: '',
    DOB: '',
    contact: '+94 ',
    emailAddress: '',
    city: '',
    district: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [contact, setContact] = useState('+94');
  const navigate = useNavigate();

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const contactRegex = /^\+94\d{9}$/;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });

    let newValue = value;
    if (name === 'contact') {
      newValue = value.replace(/\s+/g, '');
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));

    if (name === 'emailAddress' && value !== '' && !emailRegex.test(value)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        emailAddress: 'Invalid email format.',
      }));
    }

    if (name === 'contact' && newValue !== '' && !contactRegex.test(newValue)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        contact: 'Contact number must start with +94 and contain exactly 9 digits after it.',
      }));
    }

    if (name === 'NIC') {
      const nicValue = newValue.trim();
      const nicRegex = /^(\d{9}[vV]|\d{12})$/;
      if (nicValue !== '' && !nicRegex.test(nicValue)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          NIC: 'NIC must be in the format 961234567v or 199612340567.',
        }));
      }
    }

    if (name === 'password') {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{10,}$/;
      if (value && !passwordRegex.test(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          password: 'Password must be at least 10 characters long and contain uppercase letters, lowercase letters, and numbers.',
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = `${field} is required.`;
      }
    });

    if (formData.emailAddress && !emailRegex.test(formData.emailAddress)) {
      newErrors.emailAddress = 'Invalid email format.';
    }

    const contactValue = formData.contact.replace(/\s+/g, '');
    if (contactValue && !contactRegex.test(contactValue)) {
      newErrors.contact = 'Contact number must start with +94 and contain exactly 9 digits after it.';
    }

    const nicValue = formData.NIC.trim();
    const nicRegex = /^(\d{9}[vV]|\d{12})$/;
    if (nicValue && !nicRegex.test(nicValue)) {
      newErrors.NIC = 'NIC must be in the format 961234567v or 199612340567.';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    } else {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{10,}$/;
      if (!passwordRegex.test(formData.password)) {
        newErrors.password = 'Password must be at least 10 characters long and contain both uppercase and lowercase letters.';
      }
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (formData.DOB) {
      const DOB = new Date(formData.DOB);
      const age = new Date().getFullYear() - DOB.getFullYear();
      if (age < 18) {
        newErrors.DOB = 'You must be at least 18 years old.';
      }
    }

    return newErrors;
  };

  const districts = [
    'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya', 'Galle', 'Matara', 'Hambantota',
    'Jaffna', 'Kilinochchi', 'Mannar', 'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
    'Polonnaruwa', 'Anuradhapura', 'Kurunegala', 'Ratnapura', 'Kegalle', 'Badulla', 'Monaragala', 'Puttalam', 'Gampaha'
  ];

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await axios.post('http://localhost:3002/user/register', formData);

      Swal.fire('Success', 'Registration successful!', 'success');

      setFormData({
        title: '',
        firstName: '',
        lastName: '',
        address: '',
        NIC: '',
        DOB: '',
        contact: '',
        emailAddress: '',
        city: '',
        district: '',
        password: '',
        confirmPassword: '',
      });

      setErrors({});
      navigate('/login');

    } catch (error) {
      console.error(error);

      if (error.response && error.response.data.message === "User with this email or NIC already exists.") {
        Swal.fire({
          title: 'Error!',
          text: 'User with this email or NIC already exists.',
          icon: 'error',
        });
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'Something went wrong. Please try again.',
          icon: 'error',
        });
      }
    }
  };

  useEffect(() => {
    setContact('+94');
  }, []);

  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        style={{ 
          backgroundImage: 'url("https://img.freepik.com/free-vector/black-floral-seamless-pattern-with-shadow_1284-42217.jpg")', 
          backgroundSize: 'auto',}}
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
          {/* Form Fields */}
          <Box flex={2} pr={4}>
            <Typography
              variant="h4"
              gutterBottom
              style={{ fontFamily: 'cursive', fontWeight: 'bold', color: 'purple', textAlign: 'center', marginTop: '40px' }}
            >
              Create Your Account
            </Typography>

            <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit} style={{marginLeft:'40px'}}>
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
                value={formData.DOB}
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

              <TextField
                fullWidth
                margin="normal"
                label="Password"
                name="password"
                type="password"
                variant="outlined"
                value={formData.password}
                onChange={handleChange}
                helperText={errors.password}
                error={!!errors.password}
              />

              <TextField
                fullWidth
                margin="normal"
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                variant="outlined"
                value={formData.confirmPassword}
                onChange={handleChange}
                helperText={errors.confirmPassword}
                error={!!errors.confirmPassword}
              />

              <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
                style={{ marginTop: '16px' }}
              >
                Register
              </Button>
              {/* Login Link */}
              <Box mt={2} textAlign="center">
                <Typography variant="body2">
                  Already created an account?{' '}
                  <Link to="/login" style={{ color: 'blue', textDecoration: 'none' }}>
                    Log in
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
                position: 'absolute', // This makes the image fixed
                top: '240px',          // Adjust the top position if needed
                left: '900px',         // Adjust the left position if needed
              }}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default RegisterForm;
