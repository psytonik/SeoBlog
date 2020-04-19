const Tags = require('../models/Tags');
const Blog = require('../models/Blog')
const slugify = require('slugify');
const {errorHandler} = require('../helpers/dbErrorHandler');

exports.createTag = async(req,res) =>{
    try{
        const {name} = await req.body;
        let slug = slugify(name).toLowerCase();
        let tag = new Tags({name,slug});
        tag.save((error,data)=>{
            if(error){
                return res.status(400).json({error:errorHandler(error)})
            }
            return res.json(data)
        })
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Sever Error");
    }
};
exports.getTags = async (req,res)=>{
    try {
        await Tags.find({}).exec((error,data)=>{
            if(error){
                return res.status(400).json({error:errorHandler(error)})
            }
            return res.json(data)
        })
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Sever Error");
    }
};
exports.getTagBySlug = async (req,res)=>{
    try{
        const slug = await req.params.slug.toLowerCase();
        Tags.findOne({slug}).exec((error,tag)=>{
            if(error){
                return res.status(400).json({error:errorHandler(error)})
            }
            Blog.find({tags:tag})
                .populate('categories', '_id name slug')
                .populate('tags', '_id name slug')
                .populate('postedBy', '_id name profile')
                .select('_id title slug excerpt categories postedBy tags createdAt updatedAt')
                .exec((error,data)=>{
                    if(error){
                        return res.status(400).json({error:errorHandler(error)})
                    }
                    return res.json({ tags:tag, blogs : data })
                })
        })
    }catch (error) {
        console.error(error.message);
        res.status(500).send("Sever Error");
    }
};
exports.deleteTagBySlug = async (req,res)=>{
    try{
        const slug = await req.params.slug.toLowerCase();
        Tags.findOneAndRemove({slug}).exec((error)=>{
            if(error){
                return res.status(400).json({error:errorHandler(error)})
            }
            return res.json({
                message:"Tag removed successfully."
            })
        })
    }catch (error) {
        console.error(error.message);
        res.status(500).send("Sever Error");
    }
}
