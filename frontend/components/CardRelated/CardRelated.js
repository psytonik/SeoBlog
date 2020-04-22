import React from 'react';
import Link from "next/link";
import moment from "moment";
import {API} from "../../config";

const CardRelated = ({blog}) => {
    return (
        <div className="card">
            <section>
                <Link href={`/blog/${blog.slug}`}>
                    <a>
                        <img
                            className="img img-fluid"
                            style={{height: '250px', width: '100%'}}
                            src={`${API}/blog/photo/${blog.slug}`}
                            alt={`${blog.title}`}/>
                    </a>
                </Link>
            </section>
            <div className="card-body">
                <section>
                    <Link href={`/blog/${blog.slug}`}>
                        <a>
                            <h5 className="card-title">{blog.title}</h5>
                        </a>
                    </Link>
                </section>
            </div>
            <div className="card-body">
                Posted {moment(blog.createdAt).fromNow()} By <Link href={`/profile/${blog.postedBy.username}`}>
                    <a className="float-right">{blog.postedBy.name}</a></Link>
            </div>
        </div>
    );
};

export default CardRelated;
