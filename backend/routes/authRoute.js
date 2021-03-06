const express = require('express');
const router = express.Router();

/// Import Validator
const {runValidation} = require('../validators');
const {userSignUpValidator, userSignInValidator, forgotPasswordValidator, resetPasswordValidator} = require('../validators/authValidator');

const {preSignUp, signUp, signIn, signOut, forgotPassword, resetPassword} = require('../contollers/authController');

router.post('/auth/pre-signup', userSignUpValidator, runValidation, preSignUp);
router.post('/auth/signup', signUp);
router.post('/auth/signin', userSignInValidator, runValidation, signIn);
router.get('/auth/signout', signOut);
router.put('/auth/forgot-password', forgotPasswordValidator, runValidation, forgotPassword);
router.put('/auth/reset-password', resetPasswordValidator, runValidation, resetPassword);

module.exports = router;
