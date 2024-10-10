import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, TextField, MenuItem, FormControl, Select, InputLabel, TablePagination
} from '@material-ui/core';
import Sidebar from '../../Components/sidebar';
import { makeStyles } from '@material-ui/core/styles';
import { useNavigate } from 'react-router-dom';

// Custom Pagination Component
const CustomPagination = ({ count, page, rowsPerPage, onPageChange }) => {
  return (
    <TablePagination
      component="div"
      count={count}
      page={page}
      rowsPerPage={rowsPerPage}
      onPageChange={onPageChange}
      rowsPerPageOptions={[]} // Hide rows per page selector
      labelRowsPerPage="" // Hide rows per page label
    />
  );
};

const useStyles = makeStyles((theme) => ({
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
  criteriaSelect: {
    marginRight: '45px',
    minWidth: '150px',
    marginBottom: '30px',
  },
  contentContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
    flex: 1,
    margin: '15px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: '80vh',
  },
  tableContainer: {
    width: '100%',
    overflowX: 'auto',
  },
}));

const ViewDoctors = () => {
  const classes = useStyles();
  const [doctorData, setDoctorData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCriteria, setSearchCriteria] = useState("doctorName");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const navigate = useNavigate();

  // Fetch doctor data from the server
  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const response = await axios.get('http://localhost:3002/doctors/get-doctors'); // Update with your API endpoint
        setDoctorData(response.data);
      } catch (error) {
        console.error("Error fetching the doctor data!", error);
      }
    };
    fetchDoctorData();
  }, []);

  // Update handler
  const handleUpdate = (doctorId) => {
    navigate(`/update-doctor/${doctorId}`); // Navigate to the update page
  };

  // Delete handler
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3002/doctors/delete-doctor/${id}`);
      setDoctorData(doctorData.filter(doctor => doctor._id !== id)); // Update UI after deletion
    } catch (error) {
      console.error("Error deleting the doctor!", error);
    }
  };

  // Handle search input changes
  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Handle search criteria selection
  const handleCriteriaChange = (event) => {
    setSearchCriteria(event.target.value);
  };

  // Pagination change handler
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Filter and paginate doctor data
  const filteredDoctors = doctorData.filter(doctor => {
    if (!searchQuery) return true;
    const field = doctor[searchCriteria]?.toString().toLowerCase();
    return field?.startsWith(searchQuery.toLowerCase());
  });
  
  const paginatedDoctors = filteredDoctors.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box>
      <Box display="flex">
        <Sidebar />
        <Box className={classes.contentContainer}>
          <Box
            alignItems="center"
            justifyContent="space-between"
            marginTop={"60px"}
            width="100%"
            display="flex"
            flexDirection="row"
          >
            <Typography
              variant="h4"
              gutterBottom
              style={{ marginBottom: '20px', fontFamily: 'cursive', fontWeight: 'bold', color: 'purple', textAlign: 'center' }}
            >
              Doctors List
            </Typography>
            <Box display="flex" alignItems="center">
              <FormControl className={classes.criteriaSelect}>
                <InputLabel>Search By</InputLabel>
                <Select
                  value={searchCriteria}
                  onChange={handleCriteriaChange}
                  label="Search By"
                >
                  <MenuItem value="doctorName">Name</MenuItem>
                  <MenuItem value="specialization">Specialization</MenuItem>
                  <MenuItem value="contactNumber">Contact Number</MenuItem>
                  <MenuItem value="availableHours">Available Hours</MenuItem>
                </Select>
              </FormControl>
              <TextField
                variant="outlined"
                placeholder={`Search by ${searchCriteria}`}
                value={searchQuery}
                onChange={handleSearchQueryChange}
                className={classes.searchField}
              />
            </Box>
          </Box>
          <TableContainer component={Paper} className={classes.tableContainer}>
            <Table>
              <TableHead>
                <TableRow style={{ backgroundColor: '#d4ac0d', color: 'white' }}>
                  <TableCell style={{ color: 'white' }}>ID</TableCell>
                  <TableCell style={{ color: 'white' }}>Name</TableCell>
                  <TableCell style={{ color: 'white' }}>Specialization</TableCell>
                  <TableCell style={{ color: 'white' }}>Contact Number</TableCell>
                  <TableCell style={{ color: 'white' }}>Available Hours</TableCell>
                  <TableCell style={{ color: 'white' }}>Update</TableCell>
                  <TableCell style={{ color: 'white' }}>Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedDoctors.map((doctor) => (
                  <TableRow key={doctor._id}>
                    <TableCell>{doctor._id.substring(0,5)}</TableCell>
                    <TableCell>{doctor.doctorName}</TableCell>
                    <TableCell>{doctor.specialization}</TableCell>
                    <TableCell>{doctor.contactNumber}</TableCell>
                    <TableCell>{doctor.availableHours}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleUpdate(doctor._id)}
                      >
                        Update
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        onClick={() => handleDelete(doctor._id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <CustomPagination
            count={filteredDoctors.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ViewDoctors;
