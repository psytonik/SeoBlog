const express = require('express');
const router = express.Router();

/// run validators
const {tagNameValidator} = require('../validators/tagsValidator');
const {runValidation} = require('../validators');

const {requireSignIn,adminMiddleware} = require('../contollers/authController');
const {createTag,getTags,getTagBySlug,deleteTagBySlug} = require('../contollers/tagsContoller');

router.post('/Tags',tagNameValidator,runValidation,requireSignIn,adminMiddleware,createTag);
router.get('/Tags',getTags);
router.get('/Tags/:slug',getTagBySlug);
router.delete('/Tags/:slug',requireSignIn,adminMiddleware,deleteTagBySlug);
module.exports = router;
