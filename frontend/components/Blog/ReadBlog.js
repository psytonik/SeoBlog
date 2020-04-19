import React, {useState, useEffect, Fragment} from 'react';
import Link from 'next/link';
import Router from 'next/router';
import {getCookie,isAuth} from "../../service/actions/auth";
import {updateBlogBySlug,removeBlog,listOfBlog} from "../../service/actions/blog";
import {Form, FormGroup, Label, Input, Button} from "reactstrap";
import moment from "moment";

const ReadBlog = () => {
    const [blog,setBlog] = useState([]);
    const [message,setMessage] = useState('');
    const token = getCookie('token');

    useEffect(()=>{
        loadBlog()
    },[]);
    const loadBlog = () => {
        listOfBlog()
            .then(data=>{
                if(data.error){
                    setMessage(data.error)
                }
                setBlog(data)
            })
    };
    const showAllBlog = (blog) =>{
      return blog && blog.map((b,i)=>{
          return(
              <div className="col-md-4">
                  <div key={i}  className="card mb-4">
                      <div className="card-title">
                          <h3 className="text-center">{b.title}</h3>
                      </div>
                      <div className="card-body">
                          <p className="mark">Written by {b.postedBy.name} | Published on {moment(b.updatedAt).fromNow()}</p>
                          <button className="btn btn-sm btn-danger" onClick={()=>deleteConfirm(b.slug)}>Remove</button>
                          {showUpdateButton(b)}
                      </div>
                  </div>
              </div>
          )
      })
    };
    const showUpdateButton = (blog) =>{
        if(isAuth() && isAuth().role === 0) {
            return (
                <Link href={`/user/crud/blog/${blog.slug}`}>
                    <a className="btn btn-sm btn-warning ml-2">Update</a>
                </Link>
            )
        }else if (isAuth() && isAuth().role === 1){
            return (
                <Link href={`/admin/crud/${blog.slug}`}>
                    <a className="btn btn-sm btn-warning ml-2">Update</a>
                </Link>
            )
        }
    };
    const deleteConfirm = (slug) => {
        let answer = window.confirm('Are you sure you want delete Story ?');
        if(answer){
            deleteBlog(slug)
        }
    };
    const deleteBlog = (slug)=>{
        removeBlog(slug,token)
            .then(data=>{
                if(data.error){
                    console.log(data.error)
                }else{
                    setMessage(data.message);
                    loadBlog();
                }
            })
    };

    return (
        <Fragment>
            <div className="row">
                {message && <div className="alert alert-warning">{message}</div>}
                {showAllBlog(blog)}
            </div>
        </Fragment>
    );
};

export default ReadBlog;
