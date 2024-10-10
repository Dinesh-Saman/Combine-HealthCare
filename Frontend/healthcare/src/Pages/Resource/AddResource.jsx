import React, { useState } from 'react';
import { TextField, Button, Box, Typography, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@material-ui/core';
import Sidebar from '../../Components/sidebar';
import axios from 'axios';
import swal from 'sweetalert';

const AddArticle = () => {
  const [image, setImage] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState({});

  const handleImageChange = (event) => {
    setImage(event.target.value);
    setErrors(prevErrors => ({ ...prevErrors, image: '' }));
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
    setErrors(prevErrors => ({ ...prevErrors, title: '' }));
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    setErrors(prevErrors => ({ ...prevErrors, category: '' }));
  };

  const handleAuthorChange = (event) => {
    setAuthor(event.target.value);
    setErrors(prevErrors => ({ ...prevErrors, author: '' }));
  };

  const handleContentChange = (event) => {
    setContent(event.target.value);
    setErrors(prevErrors => ({ ...prevErrors, content: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!image) newErrors.image = "Image URL is required.";
    if (!title) newErrors.title = "Title is required.";
    if (!category) newErrors.category = "Category is required.";
    if (!author) newErrors.author = "Author is required.";
    if (!content) newErrors.content = "Content is required.";
    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const newArticle = {
      image,
      title,
      category,
      author,
      content,
      publish_date: new Date(),  // Automatically setting the publish date
    };

    try {
      await axios.post('http://localhost:3002/resources/add-resource', newArticle);
      swal("Success", "New article added successfully!", "success");
      setImage('');
      setTitle('');
      setCategory('');
      setAuthor('');
      setContent('');
      setErrors({});
    } catch (error) {
      console.error(error);
      swal("Error", "Something went wrong. Please try again.", "error");
    }
  };

  const categoriesList = ['nutrition', 'mental health', 'disease prevention'];

  return (
    <Box>
      <Box display="flex">
        <Sidebar />
        <Box
          display="flex"
          p={2}
          style={{ backgroundColor: 'white', borderRadius: 8, boxShadow: '0px 0px 10px rgba(0,0,0,0.1)', flex: 1, margin: '15px' }}
        >
          {/* Form Section */}
          <Box
            flex={1}
            component="form"
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
            style={{ marginRight: '20px' }} // Add some space between the form and image
          >
            <Box alignItems="center" justifyContent="center">
              <Typography variant="h4" gutterBottom style={{ fontFamily: 'cursive', fontWeight: 'bold', color: 'purple', textAlign: 'center', marginTop: '40px' }}>
                Add New Article
              </Typography>
            </Box>
            <TextField
              fullWidth
              margin="normal"
              label="Image URL"
              variant="outlined"
              value={image}
              onChange={handleImageChange}
              helperText={errors.image}
              error={!!errors.image}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Title"
              variant="outlined"
              value={title}
              onChange={handleTitleChange}
              helperText={errors.title}
              error={!!errors.title}
            />
            <FormControl fullWidth margin="normal" variant="outlined" error={!!errors.category}>
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                onChange={handleCategoryChange}
                label="Category"
              >
                {categoriesList.map(cat => (
                  <MenuItem key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</MenuItem>
                ))}
              </Select>
              <FormHelperText>{errors.category}</FormHelperText>
            </FormControl>
            <TextField
              fullWidth
              margin="normal"
              label="Author"
              variant="outlined"
              value={author}
              onChange={handleAuthorChange}
              helperText={errors.author}
              error={!!errors.author}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Content"
              variant="outlined"
              multiline
              rows={4}
              value={content}
              onChange={handleContentChange}
              helperText={errors.content}
              error={!!errors.content}
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              type="submit"
              style={{ marginTop: 16 }}
            >
              Add Article
            </Button>
          </Box>

          {/* Image Section */}
          <Box
            style={{
              flex: 1,
              textAlign: 'center',
              padding: '20px',
              marginLeft: '20px', // Ensure space between the form and image
            }}
          >
            <img
              src="https://images.pexels.com/photos/13968273/pexels-photo-13968273.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
              alt="Appointment"
              style={{
                width: '85%',
                height: 'auto',
                borderRadius: '10px',
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AddArticle;
