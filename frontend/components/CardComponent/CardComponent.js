import React from 'react';
import Link from "next/link";
import moment from "moment";
import reactRenderHtml from "react-render-html";
import {API} from "../../config";

const CardComponent = ({blog}) => {
    const showBlogCategories = blog =>{
        return blog && blog.categories.map((cat,i)=>(
            <Link href={`/categories/${cat.slug}`} key={i}>
                <a className="btn btn-outline-primary mr-1 ml-1 mb-3">{cat.name}</a>
            </Link>
        ))
    };
    const showBlogTags = blog =>{
        return blog && blog.tags.map((tag,i)=>(
            <Link href={`/tags/${tag.slug}`} key={i}>
                <a className="btn btn-primary mr-1 ml-1 mb-3">{tag.name}</a>
            </Link>
        ))
    };

    return (
        <div className="lead pb-4">
                    <div className="text-break">
                        <header>
                            <Link href={`/blog/${blog.slug}`}><a><h2
                                className="pt-3 pb-3 font-weight-bold">{blog.title}</h2></a></Link>
                        </header>
                        <section>
                            <p className="mark ml-1 pt-2 pb-2">Posted By <Link
                                href={`/profile/${blog.postedBy.username}`}>
                                <a>{blog.postedBy.name}</a></Link> | Published {moment(blog.createdAt).fromNow()}
                            </p>
                        </section>
                        <section>
                            {showBlogCategories(blog)}
                            {showBlogTags(blog)}
                            <br/>
                        </section>
                        <div className="row">
                            <div className="col-md-4">
                                <section>
                                    <img
                                        className="img img-fluid"
                                        style={{maxHeight:'auto',width:'100%'}}
                                        src={`${API}/blog/photo/${blog.slug}`}
                                        alt={`${blog.title}`}/>
                                </section>
                            </div>
                            <div className="col-md-8">
                                <section>
                                    <div className="pb-3">{reactRenderHtml(blog.excerpt)}</div>
                                    <Link href={`/blog/${blog.slug}`}>
                                        <a className="btn btn-primary pt-2">Read more</a>
                                    </Link>
                                </section>
                            </div>
                        </div>
                        <hr/>
                    </div>
        </div>

    );
};

export default CardComponent;
