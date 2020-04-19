const _ = require('lodash');
const formidable = require('formidable');
const fs = require('fs');

const User = require('../models/User');
const Blog = require('../models/Blog');
const {errorHandler} = require("../helpers/dbErrorHandler");

//// Controller
exports.readUserProfile = async (req,res) => {
    try {
        req.profile.hashed_password = undefined;
        return await res.json(req.profile);
    }  catch (error) {
        console.error(error.message);
        res.status(500).send("Sever Error");
    }
};
exports.readPublicProfile = async (req,res) => {
    try {
        let {user} = await req.params.username;
        await User.findOne({user}).exec((error,userFromDB)=>{
            if (error || !userFromDB){
                return res.status(400).json({
                    error:'This User not Found'
                })
            }
            user = userFromDB;
            let userId = user._id;
            Blog.find({postedBy:userId})
                .populate('categories','_id name slug')
                .populate('tags','_id name slug')
                .populate('postedBy','_id name about')
                .limit(10)
                .select('_id title slug excerpt categories tags postedBy createdAt updatedAt')
                .exec((error,data)=>{
                    if(error || !data){
                        return res.status(400).json({
                            error: errorHandler(error)
                        })
                    }
                    user.photo = undefined
                    user.hashed_password = undefined;
                    return res.json({user,blogs:data})
                })
        })
    }  catch (error) {
        console.error(error.message);
        res.status(500).send("Sever Error");
    }
}
exports.editUserProfile = async (req,res) => {
    try{
        let form = new formidable.IncomingForm();
        form.keepExtensions = true;
        form.parse(req,(error,fields,files)=>{
            if(error){
                return res.status(400).json({
                    error:'Photo could not be uploaded'
                })
            }
            let user = req.profile;
            user = _.extend(user,fields)

            if (fields.password && fields.password.length < 6){
                return res.status(400).json({
                    error:'Password should be minimum 6 characters long'
                })
            }

            if(files.photo){
                if(files.photo.size > 1000000){
                    return res.status(400).json({
                        error:'Image should be less than 1mb'
                    })
                }
                user.photo.data = fs.readFileSync(files.photo.path)
                user.photo.contentType = files.photo.type;
            }

            user.save((error,result)=>{
                if(error){
                    return res.status(400).json({
                        error:errorHandler(error)
                    })
                }
                user.hashed_password = undefined;
                user.salt = undefined;
                user.photo = undefined;
                return res.json(user)
            })
        })
    }catch (error) {
        console.error(error.message);
        res.status(500).send("Sever Error");
    }
}
exports.getUserPhoto = async (req,res) => {
    try{
        const {userName} = req.params.username;
        await User.findOne({userName})
            .select('photo')
            .exec((error,user)=>{
            if(error || !user ){
                return res.status(400).json({
                    error:'User photo not found'
                })
            }
            res.set("Content-Type",user.photo.contentType);
            return res.send(user.photo.data);
        })
    }catch (error) {
        console.error(error.message);
        res.status(500).send("Sever Error");
    }
}
