const Blog = require('../models/Blog');
const Category = require('../models/Category');
const Tags = require('../models/Tags');

const formidable = require('formidable');
const slugify = require('slugify');
const stripHtml = require('string-strip-html');
const _ = require('lodash');
const fs = require('fs');
const {errorHandler} = require('../helpers/dbErrorHandler');
const {smartTrim} = require('../helpers/blog');

exports.createBlog = async (req,res) =>{
    try{
        let form = new formidable.IncomingForm();
        form.keepExtensions = true;
        form.parse(req,(error,fields,files)=>{
            const {title,body,tags,categories}= fields;
            if(error){
                return res.status(400).json({error:'Image cold not uploaded'})
            }
            if(!title || !title.length){
                return res.status(400).json({
                    error:'Title is required'
                })
            }
            if(!body || body.length < 200){
                return res.status(400).json({
                    error:'Content is too short'
                })
            }
            if(!categories || categories.length === 0){
                return res.status(400).json({
                    error:'At least one category is required'
                })
            }
            if(!tags || tags.length === 0){
                return res.status(400).json({
                    error:'At least one tag is required'
                })
            }

            let blog = new Blog();
            blog.title = fields.title;
            blog.body = body;
            blog.excerpt = smartTrim(body,320,' ',' ...');
            blog.tags = tags;
            blog.slug = slugify(title).toLowerCase();
            blog.metaTitle = `${title} | ${process.env.APP_NAME}`;
            blog.metaDescription = stripHtml(body.substring(0,160));
            blog.postedBy = req.user._id;

            /// categories and tags
            let arrayOfCategories = categories && categories.split(',');
            let arrayOfTags = tags && tags.split(',');

            if(files.photo){
                if(files.photo.size > 10000000){
                    return res.status(400).json({error:errorHandler(error)})
                }
                blog.photo.data = fs.readFileSync(files.photo.path);
                blog.photo.contentType = files.photo.type;
            }
            blog.save((error,result)=>{
                if(error){
                    return res.status(400).json({
                        error:errorHandler(error)
                    })
                }
                // res.json(result)
                Blog.findByIdAndUpdate(result._id,{$push:{categories:arrayOfCategories}},{new:true})
                    .exec((error,result)=>{
                        if(error){
                            return res.status(400).json({
                                error:errorHandler(error)
                            })
                        } else{
                          Blog.findByIdAndUpdate(result._id,{$push: {tags:arrayOfTags}},{new:true})
                              .exec((error,result)=>{
                                  if(error){
                                      return res.status(400).json({
                                          error:errorHandler(error)
                                      })
                                  }else{
                                      res.json(result)
                                  }
                              })
                        }
                    });

            })
        });
    }catch (error) {
        console.error(error.message);
        res.status(500).send("Sever Error");
    }
};

exports.getBlog = async (req,res) => {
    try{
        console.log(req)
        await Blog.find({})
            .populate('categories','_id name slug')
            .populate('tags','_id name slug')
            .populate('postedBy','_id name username profile')
            .select('_id title slug excerpt categories tags postedBy createdAt updatedAt')
            .exec((error,data)=>{
                if(error){
                    return res.json({
                        error:errorHandler(error)
                    })
                }
                res.json(data)
            })
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Sever Error");
    }
};

exports.getBlogByCategoryTags = async (req,res) => {
    try{
        let limit = await req.body.limit ? await parseInt(req.body.limit): 10;
        let skip = await req.body.skip ? await parseInt(req.body.skip) : 0;

        let blogs,categories,tags;

        await Blog.find({})
            .populate('categories','_id name slug')
            .populate('tags','_id name slug')
            .populate('postedBy','_id name username profile')
            .sort({createdAt:'-1'})
            .skip(skip)
            .limit(limit)
            .select('_id title slug excerpt categories tags postedBy createdAt updatedAt')
            .exec((error,data)=>{
                if(error){
                    return res.json({
                        error:errorHandler(error)
                    })
                }
                blogs = data;
                Category.find({}).exec((error,cat)=>{
                    if(error){
                        return res.json({
                            error:errorHandler(error)
                        })
                    }
                    categories = cat;
                });
                Tags.find({}).exec((error,tag)=>{
                    if(error){
                        return res.json({
                            error:errorHandler(error)
                        })
                    }
                    tags = tag;
                    /// return all blags categories and tags
                    res.json({blogs,categories,tags,size:blogs.length})
                });

            })

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Sever Error");
    }
};

exports.getBlogBySlug = async (req,res) => {
    try{
        const slug = await req.params.slug.toLowerCase();
        await Blog.findOne({slug})
            // .select('-photo')
            .populate('categories','_id name slug')
            .populate('tags','_id name slug')
            .populate('postedBy','_id name username profile')
            .select('_id title body slug metaTitle metaDescription categories tags postedBy createdAt updatedAt')
            .exec((error,data)=>{
                if(error){
                    return res.json({
                        error:errorHandler(error)
                    })
                }
                res.json(data);
            })

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Sever Error");
    }
};

exports.deleteBlogBySlug = async (req,res) => {
    try{
        const slug = await req.params.slug.toLowerCase();
        await Blog.findOneAndRemove({slug})
            .exec((error,data)=>{
                    if(error){
                        return res.json({
                            error:errorHandler(error)
                        })
                    }
                    res.json({
                        message:'Blog removed successfully'
                    })
            })
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Sever Error");
    }
};

exports.updateBlogBySlug = async (req,res) => {
    try{
        const slug = await req.params.slug.toLowerCase();
        await Blog.findOne({slug})
            .exec((error,oldData)=>{
                if(error){
                    return res.status(400).json({error:errorHandler(error)})
                }
                let form = new formidable.IncomingForm();
                form.keepExtensions = true;
                form.parse(req,(error,fields,files)=>{

                    let slugBeforeMerge = oldData.slug;
                    oldData = _.merge(oldData,fields);
                    oldData.slug = slugBeforeMerge;

                    const {body,description,categories,tags} = fields;

                    if(body){
                        oldData.excerpt = smartTrim(body,320, ' ', ' ...');
                        oldData.description = stripHtml(body.substring(0,160))
                    }

                    if(categories){
                        oldData.categories = categories.split(',')
                    }

                    if(tags){
                        oldData.tags = tags.split(',')
                    }

                    if(files.photo){
                        if(files.photo.size > 10000000){
                            return res.status(400).json({error:errorHandler(error)})
                        }
                        oldData.photo.data = fs.readFileSync(files.photo.path);
                        oldData.photo.contentType = files.photo.type;
                    }

                    oldData.save((error,result)=>{
                        if(error){
                            return res.status(400).json({
                                error:errorHandler(error)
                            })
                        }
                        res.json(result);
                    })
                });

            });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Sever Error");
    }
};

exports.getPhoto = async (req,res) => {
  try {
      const slug = await req.params.slug.toLowerCase();
        await Blog.findOne({slug})
            .select('photo')
            .exec((error, blogData) => {
                if (error || !blogData) {
                    return res.status(400).json({
                        error: "Can't get photo"
                    })
                }
                res.set('Content-Type', blogData.photo.contentType);
                return res.send(blogData.photo.data);
            })
  }  catch(error){
      console.error(error.message);
      res.status(500).send("Sever Error");
  }
};

exports.relatedBlog = async (req,res) => {
    try{
        let limit = await req.body.limit? parseInt(req.body.limit):3;
        const {_id,categories} = await req.body.blog;
        await Blog.find({_id:{$ne:_id},categories:{$in:categories}})
            .limit(limit)
            .populate('postedBy','_id name username profile')
            .select('title slug excerpt postedBy createdAt updatedAt')
            .exec((error,blog)=>{
                if (error){
                    return res.status(400).json({
                        error:errorHandler(error)
                    })
                }
                res.json(blog)
            })
    }catch(error){
        console.error(error.message);
        res.status(500).send("Sever Error");
    }
};

exports.searchBlog = async (req,res) => {
    try{
        const {search} = await req.query;
        if (search) {
            await Blog.find(
                {
                    $or: [{ title: { $regex: search, $options: 'i' } }, { body: { $regex: search, $options: 'i' } }]
                },
                (error, blog) => {
                    if (error) {
                        return res.status(400).json({
                            error: errorHandler(error)
                        });
                    }
                    return res.json(blog);
                }
            ).select('-photo -body');
        }
    }catch(error){
        console.error(error.message);
        res.status(500).send("Sever Error");
    }
};
