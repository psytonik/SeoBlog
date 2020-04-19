import React, {useState, useEffect} from 'react';
import Router from 'next/router';
import dynamic from 'next/dynamic';
import {withRouter} from "next/router";
import {getCookie,isAuth} from "../../service/actions/auth";
import {getCategory} from "../../service/actions/category";
import {getTags} from "../../service/actions/tag";
import {getSingleBlog,updateBlogBySlug} from "../../service/actions/blog";
import {QuillModules,QuillFormats} from '../../helpers/quill';
import '../../../frontend/node_modules/react-quill/dist/quill.snow.css';
import {Form, FormGroup, Label, Input, Button} from "reactstrap";
import {API} from "../../config";
const ReactQuill = dynamic(()=>import('react-quill'),{ssr:false});

const BlogUpdate = ({router}) => {
    const token = getCookie('token');

    const [body,setBody] = useState('');
    const [categories,setCategories] = useState([]);
    const [tags,setTags] = useState([]);
    const [checked,setChecked] = useState([]); /// categories
    const [checkedTag,setCheckedTag] = useState([]); /// tags
    const [values,setValues] = useState({
        error:'',
        title:'',
        success:'',
        formData:'',
        body:''
    });
    const {error,success,title,formData} = values;

    useEffect(()=>{
        setValues({...values,formData:new FormData()});
        initBlog();
        initTags();
        initCategories();
    },[router]);

    const initBlog = () => {
        if(router.query.slug){
            getSingleBlog(router.query.slug)
                .then(data=>{
                    if(data.error){
                        console.log(data.error)
                    }
                    setValues({...values,title:data.title});
                    setBody(data.body);
                    setCategoriesArray(data.categories);
                    setTagsArray(data.tags)
                })
        }
    };

    const setCategoriesArray = blogCategories =>{
        let ca = [];
        blogCategories.map((c,i)=>{
            ca.push(c._id)
        });
        setChecked(ca);
    };

    const setTagsArray = blogTags => {
        let ta = [];
        blogTags.map((t,i)=>{
            ta.push(t._id)
        });
        setCheckedTag(ta);
    };

    const initCategories = () => {
        getCategory()
            .then((data)=>{
                if(data.error){
                    setValues({...values,error: data.error})
                }else {
                    setCategories(data)
                }
            })
    };

    const initTags = () => {
        getTags()
            .then((data)=>{
                if(data.error){
                    setValues({...values,error: data.error})
                }else {
                    setTags(data)
                }
            })
    };

    const handleBody = e => {
        setBody(e);
        formData.set('body',e)
    };

    const handleToggleCat = c => () => {
        setValues({...values,error:''});
        /// return the first index or -1
        const clickedCat = checked.indexOf(c);
        const all = [...checked];
        if(clickedCat === -1){
            all.push(c)
        }else{
            all.splice(clickedCat,1)
        }
        setChecked(all);
        formData.set('categories',all)
    };

    const handleToggleTag = t => () => {
        setValues({...values,error:''});
        /// return the first index or -1
        const clickedTag = checkedTag.indexOf(t);
        const all = [...checkedTag];
        if(clickedTag === -1){
            all.push(t)
        }else{
            all.splice(clickedTag,1)
        }
        setCheckedTag(all);
        formData.set('tags',all)
    };

    const handleChange = name => e =>{
        const value = name === 'photo' ?e.target.files[0]:e.target.value;
        formData.set(name,value);
        setValues({...values,[name]:value,formData,error:''})
    };

    const editBlog = e => {
        e.preventDefault();
        updateBlogBySlug(router.query.slug,formData,token)
            .then(data=>{
                if(data.error){
                    setValues({...values,error:data.error})
                }else {

                    setValues({...values,title:'',success:`Blog Title "${data.title}" is Successfully updated`});

                    isAuth() && isAuth().role === 1 ? Router.replace(`/admin`) : Router.replace(`/user`);
                }

            })
    };
    const updateBlogForm = () => {
        return (
            <Form onSubmit={editBlog}>
                <FormGroup>
                    <Label className="text-muted">Title</Label>
                    <Input
                        onChange={handleChange('title')}
                        value={title}
                        require="true"
                        type="text" name="title" id="title" placeholder="Title"
                    />
                </FormGroup>
                <FormGroup>
                    <Label className="text-muted">Story</Label>
                    <ReactQuill
                        modules={QuillModules}
                        formats={QuillFormats}
                        onChange={handleBody}
                        value={body}
                        require="true"
                        type="text" name="body" id="body" placeholder="Write something amazing"
                    />
                </FormGroup>
                <Button type="submit" color="primary">Publish</Button>
            </Form>
        )
    };

    const findOutCategory = c =>{
        let result = checked.indexOf(c);
        return result !== -1;
    };
    const findOutTag = t =>{
        let result = checkedTag.indexOf(t);
        return result !== -1;
    };
    const showCheckBoxesOfCategories = categories =>{
        return categories && categories.map(c=>{
            return (<li className="list-unstyled" key={c._id}>
                <input onChange={handleToggleCat(c._id)} checked={findOutCategory(c._id)} type="checkbox" className="mr-2"/>
                <label className="form-check-label">{c.name}</label>
            </li>)
        })
    };

    const showCheckBoxesOfTags = tags =>{
        return tags && tags.map(t=>{
            return (<li className="list-unstyled" key={t._id}>
                <input onChange={handleToggleTag(t._id)} checked={findOutTag(t._id)} type="checkbox" className="mr-2"/>
                <label className="form-check-label">{t.name}</label>
            </li>)
        })
    };

    const showError = () => {
        return (
            <div className="alert alert-danger" style={{display:error ? '' :'none'}}>{error}</div>
        )
    };

    const showSuccess = () => {
        return (
            <div className="alert alert-success" style={{display:success ? '' :'none'}}>{success}</div>
        )
    };

    return (
        <div className="content-fluid">
            <div className="row">
                <div className="col-md-8">
                    {updateBlogForm()}
                    <div className="container-fluid mt-3">
                        {showError()}
                        {showSuccess()}
                    </div>
                </div>
                <div className="col-md-4">
                    <div>
                        <h4>Featured Image</h4>
                        {body && (
                            <img src={`${API}/blog/photo/${router.query.slug}`} alt={title} style={{ width: '100%' }} />
                        )}
                        <hr/>
                        <small className="text-muted">Maximum size: 1mb</small>
                        <FormGroup>
                            <Label className="btn btn-outline-info">Upload featured image
                                <Input type="file" accept="image/*" className="text-muted" onChange={handleChange('photo')} hidden/>
                            </Label>
                        </FormGroup>
                    </div>
                    <div>
                        <h4>Categories</h4>
                        <hr/>
                        <ul style={{maxHeight:'200px',overflowY:"scroll"}}>
                            {showCheckBoxesOfCategories(categories)}
                        </ul>
                    </div>
                    <div>
                        <h4>Tags</h4>
                        <hr/>
                        <ul style={{maxHeight:'200px',overflowY:"scroll"}}>
                            {showCheckBoxesOfTags(tags)}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default withRouter(BlogUpdate);
