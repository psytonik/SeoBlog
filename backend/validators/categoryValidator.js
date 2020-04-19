const {check} = require('express-validator');

exports.createCategoryValidator = [
    check('name','Name is Required')
        .not()
        .isEmpty()
];
