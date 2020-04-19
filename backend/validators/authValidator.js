const {check} = require('express-validator');

exports.userSignUpValidator = [
    check('name','Name is Required')
        .not()
        .isEmpty(),
    check('email','Please include a valid email')
        .isEmail(),
    check('password','Please enter password with 6 or more characters')
        .isLength({min:6,max:18})
];
exports.userSignInValidator = [
    check('email','Please include a valid email')
        .isEmail(),
    check('password','Please enter password with 6 or more characters')
        .isLength({min:6,max:18})
];
