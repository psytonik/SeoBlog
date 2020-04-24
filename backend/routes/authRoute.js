const express = require('express');
const router = express.Router();

/// Import Validator
const {runValidation} = require('../validators');
const {userSignUpValidator, userSignInValidator} = require('../validators/authValidator');

const {signUp, signIn, signOut} = require('../contollers/authController');

router.post('/auth/signup', userSignUpValidator, runValidation, signUp);
router.post('/auth/signin', userSignInValidator, runValidation, signIn);
router.get('/auth/signout', signOut);

module.exports = router;
