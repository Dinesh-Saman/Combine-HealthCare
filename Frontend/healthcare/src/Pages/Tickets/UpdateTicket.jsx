import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, CircularProgress, Paper, Select, MenuItem, InputLabel, FormControl } from '@material-ui/core';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert';
import { makeStyles } from '@material-ui/core/styles';
import Sidebar from '../../Components/sidebar'; // Import your Sidebar component

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
    padding: '20px',
    margin: '20px',
    flexGrow: 1, // Allow the container to grow
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  formField: {
    marginBottom: theme.spacing(2),
    width: '100%',
  },
  updateButton: {
    marginTop: theme.spacing(2),
  },
  mainContent: {
    display: 'flex',
    width: '100%',
  },
}));

const UpdateTicket = () => {
  const classes = useStyles();
  const { id } = useParams(); // Get ticket ID from the URL
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    issueTitle: '',
    issueDescription: '',
    priority: '',
    status: '',
  });

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await axios.get(`http://localhost:3002/tickets/${id}`);
        setTicket(response.data);
        setFormData({
          email: response.data.email,
          issueTitle: response.data.issueTitle,
          issueDescription: response.data.issueDescription,
          priority: response.data.priority || '',
          status: response.data.status || 'Open',
        });
      } catch (error) {
        console.error('Error fetching ticket:', error);
        swal("Error", "Failed to load ticket. Please try again later.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:3002/tickets/${id}`, formData);
      swal("Success", "Ticket updated successfully!", "success");
      navigate('/view-ticket');
    } catch (error) {
      console.error('Error updating ticket:', error);
      swal("Error", "Failed to update ticket. Please try again later.", "error");
    }
  };

  return (
    <Box className={classes.mainContent}>
      <Sidebar /> {/* Render the sidebar */}
      <Paper className={classes.container}>
        <Typography variant="h5" gutterBottom>
          Update Ticket
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <TextField
              className={classes.formField}
              label="Email"
              variant="outlined"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled
            />
            <TextField
              className={classes.formField}
              label="Issue Title"
              variant="outlined"
              name="issueTitle"
              value={formData.issueTitle}
              onChange={handleChange}
            />
            <TextField
              className={classes.formField}
              label="Issue Description"
              variant="outlined"
              name="issueDescription"
              value={formData.issueDescription}
              onChange={handleChange}
            />
            {/* Priority Select */}
            <FormControl variant="outlined" className={classes.formField}>
              <InputLabel>Priority</InputLabel>
              <Select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                label="Priority"
              >
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
              </Select>
            </FormControl>
            {/* Status Select */}
            <FormControl variant="outlined" className={classes.formField}>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                label="Status"
              >
                <MenuItem value="Open">Open</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Resolved">Resolved</MenuItem>
                <MenuItem value="Closed">Closed</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              color="primary"
              className={classes.updateButton}
              onClick={handleUpdate}
            >
              Update Ticket
            </Button>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default UpdateTicket;
