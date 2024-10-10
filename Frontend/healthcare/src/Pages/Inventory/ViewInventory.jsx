import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, CircularProgress, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Sidebar from '../../Components/sidebar'; // Add the sidebar component
import axios from 'axios';
import swal from 'sweetalert';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Import the autotable plugin

const useStyles = makeStyles((theme) => ({
  container: {
    padding: '20px',
    borderRadius: 8,
    boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
    flex: 1,
    margin: '15px',
    backgroundColor: 'white',
  },
  table: {
    marginTop: theme.spacing(2),
  },
  deleteButton: {
    color: 'white',
    backgroundColor: '#f44336',
    '&:hover': {
      backgroundColor: '#d32f2f',
    },
  },
  updateButton: {
    color: 'white',
    backgroundColor: '#3f51b5',
    '&:hover': {
      backgroundColor: '#303f9f',
    },
    marginLeft: '10px',
  },
  searchField: {
    marginBottom: '20px',
    width: '300px',
    borderRadius: '25px',
    '& .MuiOutlinedInput-root': {
      borderRadius: '25px',
      padding: '5px 10px',
    },
    '& .MuiOutlinedInput-input': {
      padding: '8px 14px',
      fontSize: '14px',
    },
  },
  reportButton: {
    marginLeft: theme.spacing(2),
    backgroundColor: '#4CAF50',
    color: 'white',
    '&:hover': {
      backgroundColor: '#388E3C',
    },
  },
  contentContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableContainer: {
    width: '100%',
    overflowX: 'auto',
  },
}));

const ViewInventory = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [inventories, setInventories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchInventories = async () => {
      try {
        const response = await axios.get('http://localhost:3002/inventory');
        setInventories(response.data);
      } catch (error) {
        console.error('Error fetching inventory items:', error);
        swal('Error', 'Failed to load inventory items. Please try again later.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchInventories();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3002/inventory/${id}`);
      setInventories(inventories.filter(item => item._id !== id));
      swal('Success', 'Inventory item deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting inventory item:', error);
      swal('Error', 'Failed to delete inventory item. Please try again later.', 'error');
    }
  };

  const handleUpdate = (id) => {
    navigate(`/update-inventory/${id}`);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const generateReport = () => {
    const filteredInventories = inventories.filter(item =>
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const doc = new jsPDF();
    doc.text('Inventory Report', 14, 16);
    doc.autoTable({
      head: [['Item Name', 'Quantity', 'Unit Price', 'Supplier Email']],
      body: filteredInventories.map(item => [
        item.itemName,
        item.quantity,
        `$${item.unitPrice.toFixed(2)}`,
        item.supplierEmail,
      ]),
    });
    doc.save('inventory_report.pdf');
  };

  return (
    <Box display="flex">
      <Sidebar /> {/* Add sidebar */}
      <Box className={classes.container}>
        <Box className={classes.contentContainer}>
        <Box alignItems="center"
            justifyContent="space-between"
            marginTop={"60px"}
            width="100%"
            display="flex"
            flexDirection="row">
          <Typography variant="h4" gutterBottom style={{ fontFamily: 'cursive', fontWeight: 'bold', color: 'purple' }}>
            Inventory List
          </Typography>
         
            <TextField
              className={classes.searchField}
              label="Search by Item Name"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearch}
            />
            <Button variant="contained" className={classes.reportButton} onClick={generateReport}>
              Generate Report
            </Button>
          </Box>
        </Box>
        {loading ? (
          <CircularProgress />
        ) : (
          <TableContainer className={classes.tableContainer}>
            <Table>
              <TableHead>
                <TableRow style={{ backgroundColor: '#d4ac0d', color: 'white' }}>
                  <TableCell style={{ color: 'white' }}>Item Name</TableCell>
                  <TableCell style={{ color: 'white' }}>Quantity</TableCell>
                  <TableCell style={{ color: 'white' }}>Unit Price</TableCell>
                  <TableCell style={{ color: 'white' }}>Supplier Email</TableCell>
                  <TableCell style={{ color: 'white' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inventories
                  .filter(item => item.itemName.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((inventory) => (
                    <TableRow key={inventory._id}>
                      <TableCell>{inventory.itemName}</TableCell>
                      <TableCell>{inventory.quantity}</TableCell>
                      <TableCell>${inventory.unitPrice.toFixed(2)}</TableCell>
                      <TableCell>{inventory.supplierEmail}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          className={classes.deleteButton}
                          onClick={() => handleDelete(inventory._id)}
                        >
                          Delete
                        </Button>
                        <Button
                          variant="contained"
                          className={classes.updateButton}
                          onClick={() => handleUpdate(inventory._id)}
                        >
                          Update
                        </Button>
                      </TableCell>
                    </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Box>
  );
};

export default ViewInventory;
