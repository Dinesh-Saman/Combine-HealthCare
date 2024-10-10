import React, { useEffect, useState } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Button, Typography, CircularProgress, Paper, FormControl, InputLabel, Select, MenuItem, TextField } from '@material-ui/core';
import axios from 'axios';
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Sidebar from '../../Components/sidebar';

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
  actionsButton: {
    marginRight: theme.spacing(1),
  },
  
}));

const ViewTickets = () => {
  const classes = useStyles();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchCriteria, setSearchCriteria] = useState("email"); // Default search criteria
  const [searchQuery, setSearchQuery] = useState(""); // Search query
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get('http://localhost:3002/tickets');
        setTickets(response.data);
      } catch (error) {
        console.error('Error fetching tickets:', error);
        swal("Error", "Failed to load tickets. Please try again later.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const handleUpdate = (ticketId) => {
    navigate(`/update-ticket/${ticketId}`);
  };

  const handleDelete = async (ticketId) => {
    const confirmDelete = await swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this ticket!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });

    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:3002/tickets/${ticketId}`);
        setTickets(tickets.filter(ticket => ticket._id !== ticketId));
        swal("Ticket deleted successfully!", {
          icon: "success",
        });
      } catch (error) {
        console.error('Error deleting ticket:', error);
        swal("Error", "Failed to delete the ticket. Please try again later.", "error");
      }
    }
  };

  const handleCriteriaChange = (event) => {
    setSearchCriteria(event.target.value);
  };

  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredTickets = tickets.filter(ticket => 
    ticket[searchCriteria]?.toString().toLowerCase().includes(searchQuery.toLowerCase())
  );

  const generateReport = () => {
    const doc = new jsPDF();
    
    // Set the font style for the header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Tickets Report", 14, 22);
    
    // Add a line under the title
    doc.setLineWidth(0.5);
    doc.line(14, 26, 196, 26); // Line from (14,26) to (196,26)
    
    // Add a subtitle with smaller font size
    doc.setFontSize(12);
    doc.text("Generated on: " + new Date().toLocaleString(), 14, 30);
    
    // Set the font for the table
    doc.setFont("helvetica", "normal");
    
    // Define the columns and styles for the table
    autoTable(doc, {
      head: [['Email', 'Issue Title', 'Issue Description', 'Priority', 'Status']],
      body: filteredTickets.map(ticket => [
        ticket.email,
        ticket.issueTitle,
        ticket.issueDescription,
        ticket.priority,
        ticket.status || 'Open'
      ]),
      startY: 35, // Start the table below the header
      styles: {
        overflow: 'linebreak',
        cellPadding: 5,
        fontSize: 10,
        tableLineColor: [200, 200, 200],
        lineColor: [200, 200, 200],
      },
      headStyles: {
        fillColor: [0, 51, 102], // Dark blue background for header
        textColor: [255, 255, 255], // White text color for header
        fontSize: 11,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240], // Light grey for alternate rows
      },
      margin: { top: 20, bottom: 20, left: 14, right: 14 },
    });
    
    // Save the PDF
    doc.save('tickets_report.pdf');
  };
  

  return (
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
            Tickets List
          </Typography>
          <Box display="flex" alignItems="center">
            <FormControl className={classes.criteriaSelect}>
              <InputLabel>Search By</InputLabel>
              <Select
                value={searchCriteria}
                onChange={handleCriteriaChange}
                label="Search By"
              >
                <MenuItem value="email">Email</MenuItem>
                <MenuItem value="issueTitle">Issue Title</MenuItem>
                <MenuItem value="issueDescription">Issue Description</MenuItem>
                <MenuItem value="priority">Priority</MenuItem>
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
            <Button variant="contained" color="primary" onClick={generateReport} style={{ marginLeft: '20px' }}>
              Generate Report
            </Button>
          </Box>
        </Box>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" style={{ height: '60vh' }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper} className={classes.tableContainer}>
            <Table>
              <TableHead>
                <TableRow style={{ backgroundColor: '#d4ac0d', color: 'white' }}>
                  <TableCell style={{ color: 'white' }}>
                    <TableSortLabel>Email</TableSortLabel>
                  </TableCell>
                  <TableCell style={{ color: 'white' }}>
                    <TableSortLabel>Issue Title</TableSortLabel>
                  </TableCell>
                  <TableCell style={{ color: 'white' }}>
                    <TableSortLabel>Issue Description</TableSortLabel>
                  </TableCell>
                  <TableCell style={{ color: 'white' }}>
                    <TableSortLabel>Priority</TableSortLabel>
                  </TableCell>
                  <TableCell style={{ color: 'white' }}>
                    <TableSortLabel>Status</TableSortLabel>
                  </TableCell>
                  <TableCell style={{ color: 'white' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTickets.map((ticket) => (
                  <TableRow key={ticket._id}>
                    <TableCell>{ticket.email}</TableCell>
                    <TableCell>{ticket.issueTitle}</TableCell>
                    <TableCell>{ticket.issueDescription}</TableCell>
                    <TableCell>{ticket.priority}</TableCell>
                    <TableCell>{ticket.status || 'Open'}</TableCell>
                    <TableCell>
                      <Button variant="contained" color="primary" className={classes.actionsButton} onClick={() => handleUpdate(ticket._id)}>
                        Update
                      </Button>
                      <Button variant="contained" color="secondary" style={{marginTop:'4px'}} onClick={() => handleDelete(ticket._id)}>
                        Delete
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

export default ViewTickets;
