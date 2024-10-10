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
  Button,
  TablePagination,
} from '@material-ui/core';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ArticleReportPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get('http://localhost:3002/resources/get-resources'); // Update endpoint for articles
        setArticles(response.data);
      } catch (error) {
        console.error('Error fetching articles:', error);
        setError('Failed to load articles.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const loadImage = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve(img);
      img.onerror = reject;
    });
  };

  const handleDownload = async () => {
    try {
      const doc = new jsPDF('p', 'mm', 'a3');
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 15;
      const startY = 15;

      const logoImgUrl = "https://upload.wikimedia.org/wikipedia/commons/e/e8/Tenet_Health_logo.png";
      const img = await loadImage(logoImgUrl);

      // Add image to the PDF
      doc.addImage(img, 'PNG', margin, startY, 40, 40);

      const tableWidth = pageWidth - margin * 2;

      // Header Section
      doc.setFillColor(128, 0, 128);
      doc.rect(margin, startY, tableWidth, 50, 'F');

      doc.setFontSize(22);
      doc.setFont('courier', 'bold');
      doc.setTextColor(255, 255, 0);
      doc.text("Tenet Health", pageWidth / 2, startY + 15, { align: 'center' });

      doc.setFontSize(17);
      doc.setTextColor(255, 255, 0);
      doc.text('Article Report', pageWidth / 2, startY + 25, { align: 'center' });

      doc.setFontSize(12);
      doc.setTextColor(255, 255, 255);
      doc.text('139 Srimath Anagarika Dharmapala Mawatha, Colombo 07', pageWidth / 2, startY + 35, { align: 'center' });

      doc.setFontSize(12);
      doc.setTextColor(255, 255, 0);
      doc.text('Contact - 0114 700 700', pageWidth / 2, startY + 45, { align: 'center' });

      doc.setLineWidth(0.5);
      doc.setDrawColor(255, 255, 255);
      doc.line(margin, startY + 55, pageWidth - margin, startY + 55);

      // Table Setup
      const tableColumn = ['Title', 'Category', 'Author', 'Publish Date', 'Content'];
      const tableRows = articles.map((article) => [
        article.title || 'Untitled',
        article.category || 'Unknown',
        article.author || 'Anonymous',
        article.publish_date ? article.publish_date.substring(0, 10) : 'N/A',
        article.content || 'No Content',
      ]);

      // Add Table to PDF
      doc.autoTable({
        startY: startY + 56,
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
          fillColor: [255, 68, 51],
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
        width: tableWidth,
      });

      // Page Numbers
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(128, 128, 128);
        doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, doc.internal.pageSize.getHeight() - 10, { align: 'right' });
      }

      doc.save('article_report.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page on rows per page change
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

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
              style={{ width: '200px' }}
            />
            <Typography variant="body1" style={{ fontFamily: 'sans-serif', color: 'white', marginTop: 10 }}>
              139 Srimath Anagarika Dharmapala Mawatha, Colombo 07
              <br />
              Contact: 0114 700 700
            </Typography>
            <Typography variant="h6" style={{ fontFamily: 'serif', fontStyle: 'bold', color: 'yellow', marginTop: '20px', fontSize: '30px' }}>
              Article Report
            </Typography>
          </Box>
          <Box mt={2} mb={2}>
            <Button variant="contained" color="primary" onClick={handleDownload}>
              Download PDF
            </Button>
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Image</strong></TableCell>
                  <TableCell><strong>Title</strong></TableCell>
                  <TableCell><strong>Category</strong></TableCell>
                  <TableCell><strong>Author</strong></TableCell>
                  <TableCell><strong>Publish Date</strong></TableCell>
                  <TableCell><strong>Content</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {articles.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((article) => (
                  <TableRow key={article._id}>
                    <TableCell>{article.image ? <img src={article.image} alt="Article" style={{ width: '100px', height: '50px' }} /> : 'N/A'}</TableCell>
                    <TableCell>{article.title || 'Untitled'}</TableCell>
                    <TableCell>{article.category || 'Unknown'}</TableCell>
                    <TableCell>{article.author || 'Anonymous'}</TableCell>
                    <TableCell>{article.publish_date ? article.publish_date.substring(0, 10) : 'N/A'}</TableCell>
                    <TableCell>{article.content.substring(0,100) || 'No Content'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={articles.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ArticleReportPage;
