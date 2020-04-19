const express = require('express');
const router = express.Router();

/// run validators
const {createCategoryValidator} = require('../validators/categoryValidator');
const {runValidation} = require('../validators');

/// run middleware
const {requireSignIn,adminMiddleware} = require("../contollers/authController");
const {createCategory,getCategory,deleteCategory,getCategoryBySlug} = require('../contollers/categoryController');

router.post('/Category',createCategoryValidator,runValidation,requireSignIn,adminMiddleware,createCategory);
router.get('/Category',getCategory);
router.get('/Category/:slug',getCategoryBySlug);
router.delete('/Category/:slug',requireSignIn,adminMiddleware,deleteCategory);

module.exports = router;
