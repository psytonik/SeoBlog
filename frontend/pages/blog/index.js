import React, {useState, Fragment} from 'react';
import Head from "next/head";
import Link from "next/link";
import {withRouter} from "next/router";
import {getBlogWithCatsAndTags} from '../../service/actions/blog'
import Layout from "../../components/Layout";
import {Button} from "reactstrap";
import CardComponent from "../../components/CardComponent";
import {APP_NAME,DOMAIN} from "../../config";

const Index = ({blogs, categories, tags, blogTotal, blogLimit, router}) => {
    const head = () => (
        <Head>
            <title>Programming Blog's | {APP_NAME}</title>
            <meta name="description" content="Programming blog's and tutorials on React Node Next "/>
            <link rel="canonical" href={`${DOMAIN}${router.pathname}`}/>
            <meta property="og:title" content={`Latest web development tutorials | ${APP_NAME}`}/>
            <meta property="og:description" content="Programming blog's and tutorials on React Node Next "/>
            <meta property="og:type" content="website"/>
            <meta property="og:url" content={`${DOMAIN}${router.pathname}`}/>
            <meta property="og:site_name" content={`${APP_NAME}`}/>

            <meta property="og:image" content={`${DOMAIN}/static/images/psytonik.jpg`}/>
            <meta property="og:image:secure_url" content={`${DOMAIN}/static/images/psytonik.jpg`}/>
            <meta property="og:image:type" content="image/jpg"/>
            <meta property="fb:app_id" content={`${APP_NAME}`}/>
        </Head>
    );

    const [limit] = useState(blogLimit);
    const [skip, setSkip] = useState(0);
    const [size, setSize] = useState(blogTotal);
    const [loadedBlog, setLoadedBlog] = useState([]);

    const loadMore = () => {
        let toSkip = skip + limit;
        getBlogWithCatsAndTags(toSkip, limit)
            .then(data => {
                if (data.error) {
                    console.error(data.error)
                } else {
                    setLoadedBlog([...loadedBlog,...data.blogs]);
                    setSize(data.size);
                    setSkip(toSkip);
                }
            })
    };
    const loadMoreButton = () => {
        return (
            size > 0 && size >= limit && (<Button onClick={loadMore} color="outline-primary" className="btn-lg">Load more</Button>)
        )
    };
    const showCategories = categories => {
        return categories && categories.map(ct=>{
            return(
                <Link href={`/categories/${ct.slug}`} key={ct._id}>
                    <a className="mr-2 mb-2 btn btn-outline-primary" >
                        {ct.name}
                    </a>
                </Link>
            )
        })
    };
    const showTags = tags => {
        return tags && tags.map(t=>{
            return(
                <Link href={`/tags/${t.slug}`} key={t._id}>
                    <a className="mr-2 mb-2 btn btn-primary" >
                        {t.name}
                    </a>
                </Link>
            )
        })
    };
    const showAllBlog = () => {
        return blogs.map((blog, i) => {
            return (
                <article key={i}>
                    <CardComponent blog={blog} />
                </article>
            );
        });
    };
    const showLoadedBlog = () => {
        return loadedBlog.map((blog,i)=>{
            return (
                <article key={i}>
                    <CardComponent blog={blog}/>
                </article>
            )
        })
    };
    return (
                <Fragment>
                    {head()}
                    <Layout>
                        <main>
                            <div className="container">
                                <header>
                                    <div className="col-md-12 pt-3">
                                        <h1 className="display-4 font-weight-bold text-center">
                                            My Programming Blog
                                        </h1>
                                    </div>
                                </header>
                                <section>
                                    <div className="pb-5 text-center">
                                        <h3>categories</h3>
                                        {showCategories(categories)}
                                        <h3>tags</h3>
                                        {showTags(tags)}
                                    </div>
                                </section>
                            </div>
                            <div className="container">
                                <article>
                                    <div className="container-fluid">{showAllBlog()}</div>
                                    <div className="container-fluid">{showLoadedBlog()}</div>
                                    <div className="text-center pb-5">{loadMoreButton()}</div>
                                </article>
                            </div>
                        </main>
                    </Layout>
                </Fragment>
    );
};
Index.getInitialProps = () => {
    let skip = 0;
    let limit = 2;
    return getBlogWithCatsAndTags(skip,limit)
        .then(data=>{
            if(data.error){
                console.log(data.error)
            } else {
                return {
                    blogs:data.blogs,
                    categories:data.categories,
                    tags:data.tags,
                    blogTotal:data.size,
                    blogLimit:limit,
                    blogSkip:skip
                }
            }
        });
};
export default withRouter(Index);
