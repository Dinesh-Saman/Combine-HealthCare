import React, { useEffect, useState } from 'react';
import Sidebar from '../../Components/sidebar';
import axios from 'axios';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button
} from '@material-ui/core';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


const AppointmentReportPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get('http://localhost:3002/appointment/get-appointments');
        setAppointments(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setError('Failed to load appointments.');
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleDownload = () => {
    const doc = new jsPDF('p', 'mm', 'a3'); 
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    const startY = 15; 

    // Define the logo image URL
    const logoImgUrl = "https://upload.wikimedia.org/wikipedia/commons/e/e8/Tenet_Health_logo.png"; // Replace with your actual image URL

    // Create a new Image object
    const img = new Image();
    img.src = logoImgUrl;

    // Wait for the image to load
    img.onload = function() {
        // Add Logo Image
        doc.addImage(img, 'PNG', margin, startY, 40, 40); // Adjust x, y, width, height as needed

        // Calculate table width
        const tableWidth = pageWidth - margin * 2; // Adjust for margins

        // Draw Letterhead Background
        doc.setFillColor(128, 0, 128); // Purple color
        doc.rect(margin, startY, tableWidth, 50, 'F'); // Fill rectangle for letterhead background

        // Add Letterhead
        doc.setFontSize(22);
        doc.setFont('courier', 'bold');
        doc.setTextColor(255, 255, 0); // Yellow text
        doc.text("Tenet Health", pageWidth / 2, startY + 15, { align: 'center' }); // Adjust Y position

        // Subtitle
        doc.setFontSize(17);
        doc.setFont('courier', 'bold');
        doc.setTextColor(255, 255, 0); // Yellow text
        const subtitleY = startY + 25; 
        doc.text('Appointment Report', pageWidth / 2, subtitleY, { align: 'center' });

        // Address
        doc.setFontSize(12);
        doc.setFont('courier', 'bold');
        doc.setTextColor(255, 255, 255); // White text
        const addressY = subtitleY + 10; 
        doc.text('139 Srimath Anagarika Dharmapala Mawatha, \nColombo 07', pageWidth / 2, addressY, { align: 'center' });

        // Contact
        doc.setFontSize(12);
        doc.setFont('courier', 'normal');
        doc.setTextColor(255, 255, 0); // Yellow text
        const contactY = addressY + 12; 
        doc.text('Contact - 0114 700 700', pageWidth / 2, contactY, { align: 'center' });

        // Draw a horizontal line below the address
        doc.setLineWidth(0.5);
        doc.setDrawColor(255, 255, 255); // White line
        doc.line(margin, contactY + 18, pageWidth - margin, contactY + 18);

        // Prepare table data
        const tableColumn = ['Appointment ID', 'Name', 'Age', 'Contact', 'Doctor', 'Date', 'Time', 'Email'];
        const tableRows = appointments.map((appointment) => [
            appointment._id.substring(0, 5),
            appointment.name,
            appointment.age,
            appointment.contact,
            appointment.doctor?.doctorName || 'N/A',
            appointment.date.substring(0, 10),
            appointment.time,
            appointment.email
        ]);

        doc.autoTable({
            startY: contactY + 5,
            head: [tableColumn],
            body: tableRows,
            styles: {
                fontSize: 10,
                overflow: 'linebreak',
                cellPadding: 4,
                halign: 'center',
                valign: 'middle',
            },
            headStyles: {
                fillColor: [255, 68, 51], // Purple header
                textColor: [255, 255, 255], 
                fontStyle: 'bold',
            },
            bodyStyles: {
                fillColor: [255, 255, 255], 
                textColor: [0, 0, 0], 
                lineWidth: 0.1,
                lineColor: [200, 200, 200],
            },
            margin: { top: 0, bottom: 20, left: margin, right: margin },
            width: tableWidth, // Set table width
        });

        // Add Footer
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(10);
            doc.setTextColor(128, 128, 128); 
            doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, doc.internal.pageSize.getHeight() - 10, { align: 'right' });
        }

        doc.save('appointment_report.pdf');
    };

    img.onerror = function() {
        console.error('Error loading image.');
        // Handle error case, e.g., show a message to the user
    };
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
          style={{ 
            flex: 1, 
            minHeight: '100vh', 
            backgroundColor: 'white', 
            borderRadius: 8, 
            boxShadow: '0px 0px 10px rgba(0,0,0,0.1)', 
            margin: '15px', 
            position: 'relative',
            marginTop: '15px', 
            marginBottom: '15px',
          }} 
          id="printable-section"
        >
          <Box 
            style={{ 
              textAlign: 'center', 
              marginBottom: '20px', 
              padding: '10px', 
              borderBottom: '2px solid purple', 
              backgroundColor: '#32174D',
              width: '100%', 
              boxSizing: 'border-box',
            }}>
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/e/e8/Tenet_Health_logo.png"
              alt="Tenet Health Logo" 
              style={{ width: '200px'}} // Adjust width as needed
            />
              <Typography variant="body1" style={{ fontFamily: 'sans-serif', color: 'white', marginTop: 10 }}>
                139 Srimath Anagarika Dharmapala Mawatha, Colombo 07 
                <br />
                Contact: 0114 700 700
              </Typography>
              <Typography variant="h6" style={{ fontFamily: 'serif', fontStyle: 'bold', color: 'yellow', marginTop:'20px', fontSize:'30px' }}>
                Appointment Report
              </Typography>
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Appointment ID</strong></TableCell>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>Age</strong></TableCell>
                  <TableCell><strong>Contact</strong></TableCell>
                  <TableCell><strong>Doctor</strong></TableCell>
                  <TableCell><strong>Date</strong></TableCell>
                  <TableCell><strong>Time</strong></TableCell>
                  <TableCell><strong>Email</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow key={appointment._id}>
                    <TableCell>{appointment._id.substring(0, 5)}</TableCell>
                    <TableCell>{appointment.name}</TableCell>
                    <TableCell>{appointment.age}</TableCell>
                    <TableCell>{appointment.contact}</TableCell>
                    <TableCell>{appointment.doctor?.doctorName || 'N/A'}</TableCell>
                    <TableCell>{appointment.date.substring(0, 10)}</TableCell>
                    <TableCell>{appointment.time}</TableCell>
                    <TableCell>{appointment.email}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box mt={4}>
            <Button variant="contained" color="secondary" onClick={handleDownload}>
              Download PDF
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AppointmentReportPage;
