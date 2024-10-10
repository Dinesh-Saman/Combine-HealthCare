import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper } from '@material-ui/core';
import Sidebar from '../../Components/sidebar'; // Assuming Sidebar component is available
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import swal from 'sweetalert';

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
    padding: '20px',
    margin: '20px',
    flex: 1,
  },
  formField: {
    marginBottom: theme.spacing(2),
    width: '100%',
  },
  addButton: {
    marginTop: theme.spacing(2),
  },
  pageContainer: {
    display: 'flex',
    flexDirection: 'row',
    minHeight: '100vh',
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    padding: '20px',
  },
  imageContainer: {
    marginLeft: '40px',
    marginTop: '80px',
  },
  image: {
    height: '450px',
    width: 'auto',
  },
}));

const AddInventory = () => {
  const classes = useStyles();
  const [formData, setFormData] = useState({
    itemName: '',
    quantity: '',
    unitPrice: '',
    supplierEmail: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;

    // Add validation for Item Name to only accept letters
    if (name === 'itemName') {
      const lettersOnly = /^[A-Za-z\s]+$/; // Allows letters and spaces
      if (!lettersOnly.test(value) && value !== '') {
        setErrors((prevErrors) => ({
          ...prevErrors,
          itemName: 'Item Name can only contain letters.',
        }));
        return; // Stop if validation fails
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, itemName: '' }));
      }
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (errors.itemName) {
      return; // Prevent form submission if there are errors
    }

    try {
      await axios.post('http://localhost:3002/inventory', formData);
      swal('Success', 'Inventory item added successfully!', 'success');
      setFormData({ itemName: '', quantity: '', unitPrice: '', supplierEmail: '' }); // Reset form
    } catch (error) {
      console.error('Error adding inventory item:', error);
      swal('Error', 'Failed to add inventory item. Please try again later.', 'error');
    }
  };

  return (
    <Box className={classes.pageContainer}>
      <Sidebar /> {/* Add the Sidebar component */}
      <Box className={classes.formContainer}>
        <Paper className={classes.container}>
          <Typography
            variant="h4"
            gutterBottom
            style={{ fontFamily: 'cursive', fontWeight: 'bold', color: 'purple', textAlign: 'center', marginTop: '40px' }}
          >
            Add Inventory Item
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              className={classes.formField}
              label="Item Name"
              variant="outlined"
              name="itemName"
              value={formData.itemName}
              onChange={handleChange}
              required
              helperText={errors.itemName}
              error={!!errors.itemName}
            />
            <TextField
              className={classes.formField}
              label="Quantity"
              variant="outlined"
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleChange}
              required
            />
            <TextField
              className={classes.formField}
              label="Unit Price"
              variant="outlined"
              name="unitPrice"
              type="number"
              value={formData.unitPrice}
              onChange={handleChange}
              required
            />
            <TextField
              className={classes.formField}
              label="Supplier Email"
              variant="outlined"
              name="supplierEmail"
              type="email"
              value={formData.supplierEmail}
              onChange={handleChange}
              required
            />
            <Button
              variant="contained"
              color="primary"
              className={classes.addButton}
              type="submit"
              fullWidth
            >
              Add Item
            </Button>
          </form>
        </Paper>
        <Box className={classes.imageContainer}>
          <img
            src="https://thumbs.dreamstime.com/b/warehouse-inventory-control-manual-10655645.jpg"
            alt="Inventory"
            className={classes.image}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default AddInventory;
