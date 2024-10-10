// routes/resource.js
const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');

// Add a new resource
router.post('/add-resource/', resourceController.addNewArticle);

// Delete a resource
router.delete('/delete-resource/:id', resourceController.deleteArticle);

// Get all resources
router.get('/get-resources/', resourceController.getAllArticles);

// Get a single resource by ID
router.get('/get-resource/:id', resourceController.getArticleById);

// Update a resource
router.put('/update-resource/:id', resourceController.updateArticle);

module.exports = router;
