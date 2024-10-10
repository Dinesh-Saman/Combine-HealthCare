import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, FormControl, Select, InputLabel, Box, Typography, FormHelperText } from '@material-ui/core';
import Sidebar from '../../Components/sidebar';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import swal from 'sweetalert';

const UpdateArticle = () => {
  const { id } = useParams(); // Extract article ID from URL params
  const navigate = useNavigate();

  const [image, setImage] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [author, setAuthor] = useState('');
  const [publishDate, setPublishDate] = useState('');
  const [lastUpdatedDate, setLastUpdatedDate] = useState(''); 
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`http://localhost:3002/resources/get-resource/${id}`);
        const { image, title, category, author, publish_date, last_update_date, content } = response.data;

        setImage(image);
        setTitle(title);
        setCategory(category);
        setAuthor(author);
        setPublishDate(new Date(publish_date).toISOString().split('T')[0]);
        setLastUpdatedDate(new Date(last_update_date).toISOString().split('T')[0]); 
        setContent(content);
      } catch (error) {
        console.error(error);
        swal("Error", "Failed to fetch article data.", "error");
      }
    };

    fetchArticle();
  }, [id]);

  const validateForm = () => {
    const newErrors = {};

    // Required field validations
    if (!image) newErrors.image = "Image URL is required.";
    if (!title) newErrors.title = "Title is required.";
    if (!category) newErrors.category = "Category is required.";
    if (!author) newErrors.author = "Author name is required.";
    if (!content) newErrors.content = "Content is required.";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const articleData = {
      image,
      title,
      category,
      author,
      lastUpdatedDate,
      content,
    };

    try {
      await axios.put(`http://localhost:3002/resources/update-resource/${id}`, articleData);
      swal("Success", "Article updated successfully!", "success");
      navigate("/view-resources");
    } catch (error) {
      console.error(error);
      swal("Error", "Failed to update article data.", "error");
    }
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
          style={{ backgroundColor: 'white', borderRadius: 8, boxShadow: '0px 0px 10px rgba(0,0,0,0.1)', flex: 1, margin: '15px' }}
        >
          <Box alignItems="center" justifyContent="center">
            <Typography variant="h4" gutterBottom style={{ fontFamily: 'cursive', fontWeight: 'bold', color: 'purple', textAlign: 'center', marginTop:'40px' }}>
              Update Article Details
            </Typography>
          </Box>

          <Box display="flex" width="100%">
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              style={{ flex: 1, padding: '20px', margin: '15px' }}
            >
              <Box component="form" width="100%" noValidate autoComplete="off" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Image URL"
                  variant="outlined"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  helperText={errors.image}
                  error={!!errors.image}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Title"
                  variant="outlined"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  helperText={errors.title}
                  error={!!errors.title}
                />
                <FormControl fullWidth margin="normal" variant="outlined" error={!!errors.category}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    label="Category"
                  >
                    <MenuItem value="nutrition">Nutrition</MenuItem>
                    <MenuItem value="mental health">Mental Health</MenuItem>
                    <MenuItem value="disease prevention">Disease Prevention</MenuItem>
                  </Select>
                  <FormHelperText>{errors.category}</FormHelperText>
                </FormControl>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Author"
                  variant="outlined"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  helperText={errors.author}
                  error={!!errors.author}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Publish Date"
                  variant="outlined"
                  type="date"
                  value={publishDate}
                  InputProps={{ readOnly: true }} // Disable editing
                  disabled
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Last Updated Date"
                  variant="outlined"
                  type="date"
                  value={lastUpdatedDate} // Show the current date
                  InputProps={{ readOnly: true }} // Disable editing
                  disabled
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Content"
                  variant="outlined"
                  multiline
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  helperText={errors.content}
                  error={!!errors.content}
                />
                <Button type="submit" variant="contained" color="primary" style={{ marginTop: 20 }}>
                  Update Article Details
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default UpdateArticle;
