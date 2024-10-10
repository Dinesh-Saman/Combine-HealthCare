const Article = require("../models/resourceModel");
const mongoose = require('mongoose'); // Import mongoose for ObjectId validation
const sendEmail = require('../services/emailService');
const nodemailer = require('nodemailer');

// Add a new article
exports.addNewArticle = async (req, res) => {
    try {
        const { image, title, category, author, publish_date, content } = req.body;

        // Log the received data for debugging
        console.log(req.body);

        // Create an array to hold error messages for missing fields
        const missingFields = [];

        // Check each field and push to missingFields array if not provided
        if (!image) missingFields.push("image");
        if (!title) missingFields.push("title");
        if (!category) missingFields.push("category");
        if (!author) missingFields.push("author");
        if (!content) missingFields.push("content");

        // If there are any missing fields, return a detailed message
        if (missingFields.length > 0) {
            return res.status(400).json({ 
                message: "The following fields are required", 
                missingFields 
            });
        }

        const newArticle = new Article({
            image,
            title,
            category,
            author,
            publish_date: publish_date || Date.now(),
            content,
            last_update_date: Date.now() // Set last_update_date when creating a new article
        });

        // Save the new article
        await newArticle.save();

        // Send email notification to the admin
        const transporter = nodemailer.createTransport({
            service: 'Gmail', // Change this to your email provider
            auth: {
                user: process.env.EMAIL, // Your email address from .env
                pass: process.env.EMAIL_PASSWORD // Your email password or app password from .env
            }
        });

        const mailOptions = {
            from: process.env.EMAIL, // Your defined email address
            to: process.env.ADMIN_EMAIL, // Admin's email address from .env
            subject: 'New Article Added',
            text: `A new article titled "${title}" has been successfully added by ${author}.\n\nDetails:\n- Category: ${category}\n- Publish Date: ${publish_date || Date.now()}\n- Content: ${content}\n\nThank you!`
        };

        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ message: 'Article created but email not sent.' });
            }
            console.log('Email sent:', info.response);
        });

        res.status(201).json({ message: "New article added successfully!" });
    } catch (err) {
        console.error(err); // Log error for debugging
        res.status(500).json({ message: err.message });
    }
};

// Delete an article
exports.deleteArticle = (req, res) => {
    const articleId = req.params.id;

    Article.deleteOne({ _id: articleId })
        .then(() => {
            res.status(200).send({ status: "Article deleted" });
        })
        .catch((err) => {
            console.log(err.message);
            res.status(500).send({ status: "Error with delete article", error: err.message });
        });
};

// Get all articles
exports.getAllArticles = async (req, res) => {
    try {
        const articles = await Article.find();
        res.json(articles);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a single article by ID
exports.getArticleById = async (req, res) => {
    const { id } = req.params;

    try {
        const article = await Article.findById(id);
        if (!article) return res.status(404).json({ message: "Article not found!" });
        res.json(article);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update an article
exports.updateArticle = async (req, res) => {
    const articleId = req.params.id;
    const { image, title, category, author, publish_date, last_update_date, content } = req.body;

    // Validate inputs
    if (!(image && title && category && author && content)) {
        return res.status(400).send({ message: "All inputs are required" });
    }

    // Check if articleId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(articleId)) {
        return res.status(400).send({ message: "Invalid article ID" });
    }

    try {
        // Check if the article exists in the database
        const isArticle = await Article.findById(articleId);

        if (!isArticle) {
            return res.status(404).json({ message: "Article not found!" });
        }

        // Update the article and set last_update_date to the current date
        const result = await Article.updateOne(
            { _id: articleId },
            {
                image,
                title,
                category,
                author,
                publish_date: publish_date,
                content,
                last_update_date: last_update_date || Date.now() // Update the last_update_date
            }
        );

        if (result.modifiedCount === 0) {
            return res.status(400).json({ message: "No changes were made" });
        }

        return res.status(200).json({ message: "Article updated successfully!" });
    } catch (err) {
        console.error(err); // Log the error for debugging
        return res.status(500).json({ message: err.message });
    }
};

// Get category counts
exports.getCategoryCounts = async (req, res) => {
    try {
        // Aggregate the count of articles by category
        const categoryCounts = await Article.aggregate([
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    category: "$_id",
                    count: 1
                }
            }
        ]);

        // If there are no counts, return an empty object
        if (!categoryCounts.length) {
            return res.json({ message: "No categories found" });
        }

        res.json(categoryCounts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
