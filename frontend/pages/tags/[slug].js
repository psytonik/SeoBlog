import React,{Fragment} from 'react';
import Head from "next/head";
import Link from "next/link";
import {getTagBySlug} from '../../service/actions/tag'
import Layout from "../../components/Layout";
import {APP_NAME, DOMAIN} from "../../config";
import moment from "moment";
import reactRenderHtml from "react-render-html";
import CardRelated from "../../components/CardRelated";
import CardComponent from "../../components/CardComponent";

const SingleTag = ({tag,blogs,query}) =>{
    const head = () => (<Head>
        <title>{tag.name} | {APP_NAME}</title>
        <meta name="description" content={`Best blog by psytonik on ${tag.name}`}/>
        <link rel="canonical" href={`${DOMAIN}/tags/${query.slug}`}/>
        <meta property="og:title" content={`${tag.name} | ${APP_NAME}`}/>
        <meta property="og:description" content={'Best blog by psytonik'}/>
        <meta property="og:type" content="website"/>
        <meta property="og:url" content={`${DOMAIN}/tags/${query.slug}`}/>
        <meta property="og:site_name" content={`${APP_NAME}`}/>

        <meta property="og:image" content={`${DOMAIN}/static/images/psytonik.jpg`}/>
        <meta property="og:image:secure_url" content={`${DOMAIN}/static/images/psytonik.jpg`}/>
        <meta property="og:image:type" content="image/jpg"/>
        <meta property="fb:app_id" content={`${APP_NAME}`}/>
    </Head>);

    return (
        <Fragment>
            {head()}
            <Layout>
                <main>
                    <div className="container-fluid text-center">
                        <header>
                            <div className="col-md-12 pt-3">
                                <h1 className="display-4 font-weight-bold">
                                    {tag.slug}
                                </h1>
                                {blogs && blogs.map((blog,i)=>(
                                    <div key={i}>
                                        <CardComponent  blog={blog}/>
                                    </div>))}
                            </div>
                        </header>
                    </div>
                </main>
            </Layout>
        </Fragment>
    )
}
SingleTag.getInitialProps = ({query}) => {
    return getTagBySlug(query.slug)
        .then(data=>{
            if(data.error){
                console.log(data.error)
            }else{
                return {tag:data.tags,blogs:data.blogs,query}
            }
        })
}
export default SingleTag;
