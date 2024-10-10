import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // Import useParams and useNavigate
import { Box, Typography, TextField, Button, CircularProgress, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Sidebar from '../../Components/sidebar'; // Import the Sidebar component
import axios from 'axios';
import swal from 'sweetalert';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    margin: '15px',
    borderRadius: 8,
    boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
    backgroundColor: 'white',
  },
  form: {
    width: '100%',
    maxWidth: '600px', // Set max width for the form to center it
  },
  textField: {
    marginBottom: theme.spacing(2),
  },
  updateButton: {
    backgroundColor: '#3f51b5',
    color: 'white',
    marginTop: theme.spacing(2),
    '&:hover': {
      backgroundColor: '#303f9f',
    },
  },
  header: {
    fontFamily: 'cursive',
    fontWeight: 'bold',
    color: 'purple',
    textAlign: 'center',
    marginTop: '40px',
  },
}));

const UpdateInventory = () => {
  const classes = useStyles();
  const { id } = useParams(); // Get the inventory ID from the URL
  const navigate = useNavigate(); // Initialize useNavigate
  const [inventory, setInventory] = useState(null); // State to hold inventory item
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await axios.get(`http://localhost:3002/inventory/${id}`);
        setInventory(response.data);
      } catch (error) {
        console.error('Error fetching inventory item:', error);
        swal('Error', 'Failed to load inventory item. Please try again later.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInventory((prev) => ({ ...prev, [name]: value })); // Update inventory state
  };

  const handleUpdate = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      await axios.put(`http://localhost:3002/inventory/${id}`, inventory);
      swal('Success', 'Inventory item updated successfully!', 'success');
      navigate('/view-inventory'); // Navigate back to the inventory list
    } catch (error) {
      console.error('Error updating inventory item:', error);
      swal('Error', 'Failed to update inventory item. Please try again later.', 'error');
    }
  };

  if (loading) return <CircularProgress />; // Show loading spinner while fetching

  return (
    <Box display="flex">
      <Sidebar /> {/* Sidebar component */}
      <Box
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        p={2}
        style={{
          backgroundColor: 'white',
          borderRadius: 8,
          boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
          flex: 1,
          margin: '15px',
        }}
      >
        <Box alignItems="center" justifyContent="center">
          <Typography variant="h4" gutterBottom className={classes.header}>
            Update Inventory Item
          </Typography>
        </Box>

        <Paper className={classes.container}>
          <form onSubmit={handleUpdate} className={classes.form}>
            <TextField
              label="Item Name"
              name="itemName"
              value={inventory.itemName}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              className={classes.textField}
              required
            />
            <TextField
              label="Quantity"
              name="quantity"
              type="number"
              value={inventory.quantity}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              className={classes.textField}
              required
              InputProps={{ inputProps: { min: 0 } }} // Set min value to 0
            />
            <TextField
              label="Unit Price"
              name="unitPrice"
              type="number"
              value={inventory.unitPrice}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              className={classes.textField}
              required
            />
            <TextField
              label="Supplier Email"
              name="supplierEmail"
              type="email"
              value={inventory.supplierEmail}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              className={classes.textField}
              required
            />
            <Button type="submit" variant="contained" className={classes.updateButton}>
              Update Item
            </Button>
          </form>
        </Paper>
      </Box>
    </Box>
  );
};

export default UpdateInventory;
