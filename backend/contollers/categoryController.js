const Category = require('../models/Category');
const Blog = require('../models/Blog');
const slugify = require('slugify');
const {errorHandler} = require('../helpers/dbErrorHandler');
exports.createCategory = async (req,res) =>{
    try{
        const {name} = await req.body;
        let slug = slugify(name).toLowerCase();
        let category = new Category({name,slug});
        category.save((error,data)=>{
            if(error){
                return res.status(400).json({error:errorHandler(error)})
            }
            return res.json(data);
        })
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Sever Error");
    }
};
exports.getCategory = async (req,res)=>{
    try{
        await Category.find({}).exec((error,data)=>{
            if(error){
                return res.status(400).json({error:errorHandler(error)})
            }
            return res.json(data);
        })
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Sever Error");
    }
};
exports.getCategoryBySlug = async (req,res) =>{
    try{
        const slug = await req.params.slug.toLowerCase();
        await Category.findOne({slug}).exec((error,category)=>{
            if(error){
                return res.status(400).json({error:errorHandler(error)})
            }
            Blog.find({categories:category})
                .populate('categories', '_id name slug')
                .populate('tags', '_id name slug')
                .populate('postedBy', '_id name profile')
                .select('_id title slug excerpt categories postedBy tags createdAt updatedAt')
                .exec((error,data)=>{
                    if(error){
                        return res.status(400).json({error:errorHandler(error)})
                    }
                    return res.json({ category, blogs : data })
                })
        })
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Sever Error");
    }
};
exports.deleteCategory = async (req,res) =>{
    try{
        const slug = await req.params.slug.toLowerCase();
        await Category.findOneAndRemove({slug}).exec((error,data)=>{
            if(error){
                return res.status(400).json({error:errorHandler(error)})
            }
            return res.json({
                message:"CategoryTag removed successfully."
            });
        })
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Sever Error");
    }
};
