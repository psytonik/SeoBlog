const {check} = require('express-validator');

exports.createBlogValidator = [
    check('title','Title is Required')
        .not()
        .isEmpty()
];
