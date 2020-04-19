
const express = require('express');
const router = express.Router();

const {runValidation} = require('../validators');
const {createBlogValidator} = require('../validators/blogValidation');
const {requireSignIn,authMiddleware} = require('../contollers/authController');
const {
    createBlog,getBlog,getBlogByCategoryTags,
    getBlogBySlug,deleteBlogBySlug,updateBlogBySlug,
    getPhoto,relatedBlog,searchBlog
} = require('../contollers/blogController');

//// write new blog
router.post('/blog',requireSignIn,authMiddleware,createBlog);

/// update existing blog
router.put('/blog/:slug',requireSignIn,authMiddleware,updateBlogBySlug);

/// delete existing blog
router.delete('/blog/:slug',requireSignIn,authMiddleware,deleteBlogBySlug);

/// blog by with category and tag
router.post('/blog-cat-tag',getBlogByCategoryTags);

/// get single blog by slug
router.get('/blog/:slug',getBlogBySlug);

/// get all blog's
router.get('/blog',getBlog);

/// get photo of blog by slug
router.get('/blog/photo/:slug',getPhoto);

/// get related blog by category
router.post('/blog/related',relatedBlog);

/// search blog article
router.get('/blogs/search',searchBlog);

module.exports = router;
