const express = require('express');
const router = express.Router();
const {requireSignIn,authMiddleware} = require('../contollers/authController');
const {readUserProfile,readPublicProfile,editUserProfile,getUserPhoto} = require('../contollers/userContoller');

router.get('/user/profile',requireSignIn,authMiddleware,readUserProfile);
router.get('/user/:username',readPublicProfile);
router.put('/user/edit',requireSignIn,authMiddleware, editUserProfile);
router.get('/user/photo/:username',getUserPhoto);

module.exports = router;
