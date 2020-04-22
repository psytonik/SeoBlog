const express = require('express');
const router = express.Router();

/// Import Validator
const {runValidation} = require('../validators');
const {userSignUpValidator,userSignInValidator} = require('../validators/authValidator');

const {signUp,signIn,signOut,requireSignIn} = require('../contollers/authController');

router.post('/Auth/signup',userSignUpValidator,runValidation,signUp);
router.post('/Auth/signin',userSignInValidator,runValidation,signIn);
router.get('/Auth/signout',signOut);

module.exports = router;
