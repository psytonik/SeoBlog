import React, {useState, useEffect} from 'react';
import dynamic from 'next/dynamic';
import {withRouter} from "next/router";
import {getCookie,isAuth} from "../../service/actions/auth";
import {getCategory} from "../../service/actions/category";
import {getTags} from "../../service/actions/tag";
import {createBlog} from "../../service/actions/blog";
import {QuillModules,QuillFormats} from '../../helpers/quill';
import '../../../frontend/node_modules/react-quill/dist/quill.snow.css';
import {Form, FormGroup, Label, Input, Button} from "reactstrap";

const ReactQuill = dynamic(()=>import('react-quill'),{ssr:false});

const CreateBlog = ({router}) => {

    const blogFormLocalStorage = () => {
      if (typeof window === 'undefined'){
          return false
      }
      if(localStorage.getItem('blog')){
          return JSON.parse(localStorage.getItem('blog'))
      } else {
          return false;
      }
    };

    const token = getCookie('token');
    const [body,setBody] = useState(blogFormLocalStorage());
    const [values,setValues] = useState({
        error:'',
        sizeError:'',
        title:'',
        success:'',
        formData:'',
        hidePublishButton:false
    });
    const [categories,setCategories] = useState([]);
    const [tags,setTags] = useState([]);
    const [checked,setChecked] = useState([]);
    const [checkedTag,setCheckedTag] = useState([]);

    const {title,error,success,sizeError,hidePublishButton,formData} = values;

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

    useEffect(()=>{
        setValues({...values,formData: new FormData()});
        initCategories();
        initTags();
    },[router]);

    const publishBlog = (e) => {
        e.preventDefault();
        createBlog(formData,token)
            .then(data=>{
                if(data.error){
                    setValues({...values,error:data.error})
                } else {
                    setValues({...values,title: '',error:'', success:`A new blog titled ${data.title} is created`});
                    setBody('');
                    setCategories([]);
                    setTags([])
                }
            })
    };

    const handleChange = name => e =>{
        const value = name === 'photo' ?e.target.files[0]:e.target.value;
        formData.set(name,value);
        setValues({...values,[name]:value,formData,error:''})
    };

    const handleBody = e =>{
        setBody(e);
        formData.set('body',e);
        if(typeof window !== 'undefined'){
            localStorage.setItem('blog',JSON.stringify(e))
        }
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

    const createBlogForm = () => {
        return (
            <Form onSubmit={publishBlog}>
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

    const showCheckBoxesOfCategories = categories =>{
        return categories && categories.map(c=>{
            return (<li className="list-unstyled" key={c._id}>
                <input onChange={handleToggleCat(c._id)} type="checkbox" className="mr-2"/>
                <label className="form-check-label">{c.name}</label>
            </li>)
        })
    };

    const showCheckBoxesOfTags = tags =>{
        return tags && tags.map(t=>{
            return (<li className="list-unstyled" key={t._id}>
                <input onChange={handleToggleTag(t._id)} type="checkbox" className="mr-2"/>
                <label className="form-check-label">{t.name}</label>
            </li>)
        })
    };

    return (
        <div className="content-fluid">
            <div className="row">
                <div className="col-md-8">
                    {createBlogForm()}
                    <div className="container-fluid mt-3">
                        {showSuccess()}
                        {showError()}
                    </div>
                </div>
                <div className="col-md-4">
                    <div>
                        <h4>Featured Image</h4>
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
                        <ul style={{maxHeight:'200px',overflowY:"scroll"}}>{showCheckBoxesOfTags(tags)}</ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default withRouter(CreateBlog);
