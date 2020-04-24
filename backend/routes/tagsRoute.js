const express = require('express');
const router = express.Router();

/// run validators
const {tagNameValidator} = require('../validators/tagsValidator');
const {runValidation} = require('../validators');

const {requireSignIn, adminMiddleware} = require('../contollers/authController');
const {createTag, getTags, getTagBySlug, deleteTagBySlug} = require('../contollers/tagsContoller');

router.post('/tags', tagNameValidator, runValidation, requireSignIn, adminMiddleware, createTag);
router.get('/tags', getTags);
router.get('/tags/:slug', getTagBySlug);
router.delete('/tags/:slug', requireSignIn, adminMiddleware, deleteTagBySlug);
module.exports = router;
