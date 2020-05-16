const Blog = require('../models/Blog');
const User = require('../models/User');
const shortId = require('shortid');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const {errorHandler} = require("../helpers/dbErrorHandler");
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const _ = require('lodash');
//// Controllers
exports.preSignUp = async (req, res) => {
    try {
        const {name, email, password} = req.body;
        await User.findOne({email: email.toLowerCase()}, (error, user) => {
            if (user) {
                return res.status(400).json({
                    error: `User with this ${email} is already exists`
                })
            }
            const token = jwt.sign({name, email, password}, process.env.JWT_ACCOUNT_ACTIVATION, {expiresIn: '10m'});
            const emailData = {
                from: process.env.EMAIL_FROM,
                to: email,
                subject: `Account Activation Link`,
                html: `
                <p>${name} Please use the following link to activate your account:</p>
                <p>${process.env.CLIENT_URL}/auth/account/activate/${token}</p>
                <hr/>
                <p>This email may contain sensitive information</p>
                <p>https://anthonyfink.dev</p>`
            };
            sgMail.send(emailData)
                .then(() => {
                    return res.json({message: `Email has been sent to ${email} Follow the instructions to activate account.`})
                })
        })
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Sever Error")
    }
};

// exports.signUp = async (req, res) => {
//     try {
//         await User.findOne({email: req.body.email})
//             .exec((error, user) => {
//                 if (user) {
//                     return res.status(400).json({
//                         error: 'Email is already exists'
//                     })
//                 }
//                 const {name, email, password} = req.body;
//                 let username = shortId.generate();
//                 let profile = `${process.env.CLIENT_URL}/profile/${username}`;
//                 let newUser = new User({name, email, password, profile, username});
//                 newUser.save((error) => {
//                     if (error) {
//                         return res.status(400).json({error: error});
//                     }
//                     return res.json({message: 'Sign Up success! Please Sign In'});
//                 })
//             })
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).send("Sever Error")
//     }
// };

exports.signUp = async (req, res) => {
    try {
        const token = req.body.token;
        if (token) {
            jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, (error) => {
                if (error) {
                    return res.status(401).json({
                        error: 'Expired Link, Please Sign Up again'
                    })
                }
                const {name, email, password} = jwt.decode(token);
                let username = shortId.generate();
                let profile = `${process.env.CLIENT_URL}/profile/${username}`;
                let newUser = new User({name, email, password, profile, username});
                newUser.save((error) => {
                    if (error) {
                        return res.status(401).json({error: errorHandler(error)});
                    }
                    return res.json({message: 'Sign Up success! Please Sign In'});
                })
            })
        } else {
            return res.json({message: 'Something went wrong, Try again !!!'});
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Sever Error")
    }
}
exports.signIn = async (req, res) => {
    /// Check if user exists
    try {
        const {email, password} = await req.body;
        await User.findOne({email}).exec((error, user) => {
            if (!user || error) {
                return res.status(404).json({error: "User with that email not found or does not exist. Please Sign Up"})
            }
            //// Authenticate
            if (!user.authenticate(password)) {
                return res.status(400).json({error: "Email and reset-password do not match"})
            }
            /// Generate Json Web Token and send to client
            const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn: '1d'});
            res.cookie('token', token, {expiresIn: '1d'});
            const {_id, username, name, email, role} = user;
            return res.json({
                token,
                user: {_id, username, name, email, role}
            })
        })
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Sever Error")
    }
};
exports.signOut = async (req, res) => {
    try {
        await res.clearCookie("token");
        await res.json({
            message: "Sign Out Success"
        })
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Sever Error");
    }
};

//// Middleware
exports.requireSignIn = expressJwt({
    secret: process.env.JWT_SECRET
});

exports.authMiddleware = async (req, res, next) => {
    try {
        const authUserId = await req.user._id;
        await User.findById({_id: authUserId})
            .exec((error, user) => {
                if (error || !user) {
                    res.status(404).json({error: 'User not found'})
                }
                req.profile = user;
                next();
            })
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Sever Error")
    }
};

exports.adminMiddleware = async (req, res, next) => {
    try {
        const adminUserId = await req.user._id;
        await User.findById({_id: adminUserId})
            .exec((error, user) => {
                if (error || !user) {
                    res.status(404).json({error: 'User not found'})
                }
                if (user.role !== 1) {
                    res.status(401).json({error: 'Access denied !'})
                }
                req.profile = user;
                next();
            })
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Sever Error")
    }
};

exports.canUpdateDeleteBlog = async (req, res, next) => {
    const slug = req.params.slug.toLowerCase();
    Blog.findOne({slug})
        .exec((error, data) => {
            if (error) {
                return res.status(400).json({error: errorHandler(error)})
            }
            let authorizedUsed = data.postedBy._id.toString() === req.profile._id.toString();
            if (!authorizedUsed) {
                return res.status(400).json({error: 'You are not authorized'})
            }
            next();
        })
};
exports.forgotPassword = async (req, res) => {
    try {
        const {email} = await req.body;
        await User.findOne({email}, (error, user) => {
            if (error || !user) {
                return res.status(404).json({
                    error: 'User with this email does not exists'
                })
            }
            const token = jwt.sign({id: user._id}, process.env.JWT_RESET_PASSWORD, {expiresIn: '90m'})
            const emailData = {
                from: process.env.EMAIL_FROM,
                to: email,
                subject: `Password Reset Link from AnthonyFink.dev Blog`,
                html: `
                <p>Please use the following link to reset your password:</p>
                <p>${process.env.CLIENT_URL}/auth/reset-password/${token}</p>
                <hr/>
                <p>This email may contain sensitive information</p>
                <p>https://anthonyfink.dev</p>
            `
            };
            return user.updateOne({resetPasswordLink: token}, (error) => {
                if (error) {
                    return res.json({error: errorHandler(error)})
                } else {
                    sgMail.send(emailData)
                        .then(() => {
                            return res.json({
                                message: `Email has been sent to ${email}. Follow the Instructions to reset your password. Link expires in 90 minutes`
                            })
                        })
                }
            })

        })
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Sever Error")
    }
}
exports.resetPassword = async (req, res) => {
    try {
        const {resetPasswordLink, newPassword} = await req.body;
        if (resetPasswordLink) {
            jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD, (error, decoded) => {
                console.log(decoded, 'decoded reset-password')
                if (error) {
                    return res.status(401).json({
                        error: 'Expired Link, Try again'
                    })
                }
                User.findOne({resetPasswordLink}, (error, user) => {
                    if (error || !user) {
                        return res.status(401).json({
                            error: 'User with this email does not exists'
                        })
                    }
                    const updatedFields = {
                        password: newPassword,
                        resetPasswordLink: ''
                    }
                    user = _.extend(user, updatedFields)
                    user.save((error) => {
                        if (error) {
                            return res.status(400).json({
                                error: errorHandler(error)
                            })
                        }
                        res.json({
                            message: `Great! Now you can login with your new password`
                        })
                    })
                })
            })
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Sever Error")
    }
}
