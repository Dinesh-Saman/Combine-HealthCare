import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, MenuItem, FormControl, Select, InputLabel, TablePagination } from '@material-ui/core';
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
      rowsPerPageOptions={[]} 
      labelRowsPerPage="" 
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

const ViewAppointments = () => {
  const classes = useStyles();
  const [appointmentData, setAppointmentData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCriteria, setSearchCriteria] = useState("name");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointmentData = async () => {
      try {
        const response = await axios.get('http://localhost:3002/appointment/get-appointments');
        setAppointmentData(response.data);
      } catch (error) {
        console.error("There was an error fetching the appointment data!", error);
      }
    };

    fetchAppointmentData();
  }, []);

  const handleUpdate = (appointmentId) => {
    navigate(`/update-appointment/${appointmentId}`); // Navigate to the update page with the appointment ID
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3002/appointment/delete-appointment/${id}`);
      setAppointmentData(appointmentData.filter(appointment => appointment._id !== id));
    } catch (error) {
      console.error("There was an error deleting the appointment!", error);
    }
  };

  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleCriteriaChange = (event) => {
    setSearchCriteria(event.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const filteredAppointments = appointmentData.filter(appointment => {
    if (!searchQuery) return true;
    const field = searchCriteria === "doctorName" ? appointment.doctor?.doctorName?.toLowerCase() : appointment[searchCriteria]?.toString().toLowerCase();
    return field?.startsWith(searchQuery.toLowerCase());
  });
  

  const paginatedAppointments = filteredAppointments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
            <Typography variant="h4" gutterBottom style={{ marginBottom: '20px', fontFamily: 'cursive', fontWeight: 'bold', color: 'purple', textAlign: 'center' }}>
              Appointments
            </Typography>
            <Box display="flex" alignItems="center">
              <FormControl className={classes.criteriaSelect}>
                <InputLabel>Search By</InputLabel>
                <Select
                    value={searchCriteria}
                    onChange={handleCriteriaChange}
                    label="Search By"
                    >
                    <MenuItem value="name">Patient Name</MenuItem>
                    <MenuItem value="age">Age</MenuItem>
                    <MenuItem value="contact">Contact</MenuItem>
                    <MenuItem value="doctorName">Doctor Name</MenuItem>
                    <MenuItem value="appointmentDate">Appointment Date</MenuItem>
                    <MenuItem value="time">Time</MenuItem>
                    <MenuItem value="email">Email</MenuItem>
                    <MenuItem value="status">Status</MenuItem>
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
                  <TableCell style={{ color: 'white' }}>Patient</TableCell>
                  <TableCell style={{ color: 'white' }}>Age</TableCell>
                  <TableCell style={{ color: 'white' }}>Contact</TableCell>
                  <TableCell style={{ color: 'white' }}>Doctor</TableCell>
                  <TableCell style={{ color: 'white' }}>Date</TableCell>
                  <TableCell style={{ color: 'white' }}>Time</TableCell>
                  <TableCell style={{ color: 'white' }}>Email</TableCell>
                  <TableCell style={{ color: 'white' }}>Update</TableCell>
                  <TableCell style={{ color: 'white' }}>Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedAppointments.map((appointment) => (
                  <TableRow key={appointment._id}>
                    <TableCell>{appointment._id.substring(0,5)}</TableCell>
                    <TableCell>{appointment.name}</TableCell>
                    <TableCell>{appointment.age}</TableCell>
                    <TableCell>{appointment.contact}</TableCell>
                    <TableCell>{appointment.doctor?.doctorName || 'N/A'}</TableCell>
                    <TableCell>{appointment.date.substring(0,10)}</TableCell>
                    <TableCell>{appointment.time}</TableCell>
                    <TableCell>{appointment.email}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleUpdate(appointment._id)}
                      >
                        Update
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        onClick={() => handleDelete(appointment._id)}
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
            count={filteredAppointments.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ViewAppointments;
