
const express = require('express');
const router = express.Router();

const {runValidation} = require('../validators');
const {createBlogValidator} = require('../validators/blogValidation');
const {requireSignIn, authMiddleware, adminMiddleware, canUpdateDeleteBlog} = require('../contollers/authController');
const {
    createBlog, getBlog, getBlogByCategoryTags,
    getBlogBySlug, deleteBlogBySlug, updateBlogBySlug,
    getPhoto, relatedBlog, searchBlog, getBlogByUser
} = require('../contollers/blogController');


//// write new blog
router.post('/blog', requireSignIn, adminMiddleware, createBlog);

/// update existing blog
router.put('/blog/:slug', requireSignIn, adminMiddleware, updateBlogBySlug);

/// delete existing blog
router.delete('/blog/:slug', requireSignIn, adminMiddleware, deleteBlogBySlug);

/// blog by with category and tag
router.post('/blog-cat-tag',getBlogByCategoryTags);

/// get single blog by slug
router.get('/blog/:slug',getBlogBySlug);

/// get all blog's
router.get('/blog',getBlog);

/// get photo of blog by slug
router.get('/blog/photo/:slug', getPhoto);

/// get related blog by category
router.post('/blog/related', relatedBlog);

/// search blog article
router.get('/blogs/search', searchBlog);

/// Auth user blog crud
router.post('/user/blog', requireSignIn, authMiddleware, createBlog);

/// get all blog's
router.get('/:username/blog', getBlogByUser);

/// update existing blog
router.put('/user/blog/:slug', requireSignIn, authMiddleware, canUpdateDeleteBlog, updateBlogBySlug);

/// delete existing blog
router.delete('/user/blog/:slug', requireSignIn, authMiddleware, canUpdateDeleteBlog, deleteBlogBySlug);

module.exports = router;
