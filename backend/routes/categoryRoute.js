const express = require('express');
const router = express.Router();

/// run validators
const {createCategoryValidator} = require('../validators/categoryValidator');
const {runValidation} = require('../validators');

/// run middleware
const {requireSignIn, adminMiddleware} = require("../contollers/authController");
const {createCategory, getCategory, deleteCategory, getCategoryBySlug} = require('../contollers/categoryController');

router.post('/category', createCategoryValidator, runValidation, requireSignIn, adminMiddleware, createCategory);
router.get('/category', getCategory);
router.get('/category/:slug', getCategoryBySlug);
router.delete('/category/:slug', requireSignIn, adminMiddleware, deleteCategory);

module.exports = router;
