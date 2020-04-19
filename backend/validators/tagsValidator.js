const {check} = require('express-validator');

exports.tagNameValidator = [
    check('name','Tag Name is required')
        .not()
        .isEmpty()
];
