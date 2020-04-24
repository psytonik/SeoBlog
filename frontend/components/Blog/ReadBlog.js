import React, {useState, useEffect, Fragment} from 'react';
import Link from 'next/link';
import {getCookie, isAuth} from "../../service/actions/auth";
import {removeBlog, listOfBlog} from "../../service/actions/blog";
import {CardBody, CardTitle, Card, Col, Row} from "reactstrap";
import moment from "moment";

const ReadBlog = ({username}) => {
    const [blog, setBlog] = useState([]);
    const [message, setMessage] = useState('');
    const token = getCookie('token');

    useEffect(() => {
        loadBlog()
    }, []);
    const loadBlog = () => {
        listOfBlog(username)
            .then(data => {
                if(data.error){
                    setMessage(data.error)
                }
                setBlog(data)
            })
    };
    const showAllBlog = (blog) =>{
      return blog && blog.map((b,i)=>{
          return (
              <Col col-md={4} key={i}>
                  <Card className="mb-4">
                      <CardTitle>
                          <h3 className="text-center text-break">{b.title}</h3>
                      </CardTitle>
                      <CardBody>
                          <p className="mark">Written by {b.postedBy.name} | Published
                              on {moment(b.updatedAt).fromNow()}</p>
                          <button className="btn btn-sm btn-danger" onClick={() => deleteConfirm(b.slug)}>Remove
                          </button>
                          {showUpdateButton(b)}
                      </CardBody>
                  </Card>
              </Col>
          )
      })
    };
    const showUpdateButton = (blog) =>{
        if(isAuth() && isAuth().role === 0) {
            return (
                <Link href={`/user/crud/${blog.slug}`}>
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
            <Row>
                {message && <div className="alert alert-warning">{message}</div>}
                {showAllBlog(blog)}
            </Row>
        </Fragment>
    );
};

export default ReadBlog;
