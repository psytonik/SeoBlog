import React,{useState,useEffect,Fragment} from 'react';
import Head from "next/head";
import Link from "next/link";
import {getSingleBlog,relatedBlog} from '../../service/actions/blog'
import Layout from "../../components/Layout";
import {APP_NAME, DOMAIN,API} from "../../config";
import moment from "moment";
import reactRenderHtml from "react-render-html";
import CardRelated from "../../components/CardRelated";

const SingleBlog = ({blog}) => {
    const [related,setRelated] = useState([]);
    const loadRelated = () =>{
        relatedBlog({blog})
            .then(data=>{
                if(data.error){
                    console.log(data.error)
                }else{
                    setRelated(data)
                }
            })
    };
    useEffect(()=>{
       loadRelated()
    },[]);
    const showRelatedBlog = (related) => {
        return related && related.map((blog,i)=>{
            return (
                        <div className="col-md-4 text-break" key={i}>
                            <article>
                                <CardRelated blog={blog}/>
                            </article>
                        </div>
            )
        })
    };
    const head = () => (<Head>
            <title>{blog.title} | {APP_NAME}</title>
            <meta name="description" content={blog.metaDescription}/>
            <link rel="canonical" href={`${DOMAIN}/blog/${blog.slug}`}/>
            <meta property="og:title" content={`${blog.title} | ${APP_NAME}`}/>
            <meta property="og:description" content={blog.metaDescription}/>
            <meta property="og:type" content="website"/>
            <meta property="og:url" content={`${DOMAIN}/blog/${blog.slug}`}/>
            <meta property="og:site_name" content={`${APP_NAME}`}/>

            <meta property="og:image" content={`${DOMAIN}/static/images/psytonik.jpg`}/>
            <meta property="og:image:secure_url" content={`${DOMAIN}/static/images/psytonik.jpg`}/>
            <meta property="og:image:type" content="image/jpg"/>
            <meta property="fb:app_id" content={`${APP_NAME}`}/>
        </Head>);

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
    return(
        <Fragment>
            {head()}
            <Layout>
                <main>
                    <article>
                        <div className="container-fluid">
                            <section>
                                <div className="row" style={{marginTop:'-30px'}}>
                                    <img src={`${API}/blog/photo/${blog.slug}`} alt={blog.title} className="img img-fluid featured-image"/>
                                </div>
                            </section>
                            <section>
                                <div className="container-fluid text-center">
                                    <h1 className="display-3 pb-3 font-weight-bold pt-3 text-break">{blog.title}</h1>
                                    <p className="lead mt-3 mark">
                                        Posted By <Link
                                        href={`/profile/${blog.postedBy.username}`}><a>{blog.postedBy.name}</a></Link>|
                                        Published {moment(blog.createdAt).fromNow()}
                                    </p>
                                    <div className="pb-3">
                                        {showBlogCategories(blog)}
                                        {showBlogTags(blog)}
                                    </div>
                                </div>
                            </section>
                        </div>
                        <div className="container">
                            <section>
                                <div className="col-md-12 lead text-break">
                                    {reactRenderHtml(blog.body)}
                                </div>
                                <hr/>
                                <div className="container pb-5">
                                    <h4 className="text-center pt-5 pb-5 h2">Related Blog's</h4>
                                    <div className="row">
                                        {showRelatedBlog(related)}
                                    </div>
                                </div>
                                <div className="container pb-5">
                                    <br/>
                                    <p>show comments</p>
                                </div>
                            </section>
                        </div>
                    </article>
                </main>
            </Layout>
        </Fragment>
    )
};
SingleBlog.getInitialProps = ({query}) =>{
  return getSingleBlog(query.slug)
      .then(data=>{
          if (data.error){
              console.error(data.error)
          } else {
              return {
                  blog:data
                  // categories:data.categories,
                  // tags:data.tags,
                  // _id:data._id,
                  // title:data.title,
                  // body:data.body,
                  // slug:data.slug,
                  // metaTitle:data.metaTitle,
                  // metaDescription:data.metaDescription,
                  // postedBy:data.postedBy
              }
          }
      })
};
export default SingleBlog;
