const Blog = require('../models/Blog');

const User = require('../models/User');
const shortId = require('shortid');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const {errorHandler} = require("../helpers/dbErrorHandler");

//// Controllers
exports.signUp = async (req, res) => {
    try {
        await User.findOne({email: req.body.email})
            .exec((error, user) => {
                if (user) {
                    return res.status(400).json({
                        error: 'Email is already exists'
                    })
                }
                const {name, email, password} = req.body;
                let username = shortId.generate();
                let profile = `${process.env.CLIENT_URL}/profile/${username}`;
                let newUser = new User({name, email, password, profile, username});
                newUser.save((error, success) => {
                    if (error) {
                        return res.status(400).json({error: error});
                    }
                    return res.json({message: 'Sign Up success! Please Sign In'});
                })
            })
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Sever Error")
    }
};
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
                return res.status(400).json({error: "Email and password do not match"})
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
            let authorizedUsed = data.postedBy._id.toString() === req.profile.toString();
            if (!authorizedUsed) {
                return res.status(400).json({error: 'You are not authorized'})
            }
            next();
        })
};
