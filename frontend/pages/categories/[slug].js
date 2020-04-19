import React,{Fragment} from 'react';
import Head from "next/head";
import {getCategoryBySlug} from '../../service/actions/category'
import Layout from "../../components/Layout";
import {APP_NAME, DOMAIN} from "../../config";
import CardComponent from "../../components/CardComponent";

const SingleCategory = ({category,blogs,query}) => {
    const head = () => (<Head>
        <title>{category.name} | {APP_NAME}</title>
        <meta name="description" content={`Best blog by psytonik on ${category.name}`}/>
        <link rel="canonical" href={`${DOMAIN}/categories/${query.slug}`}/>
        <meta property="og:title" content={`${category.name} | ${APP_NAME}`}/>
        <meta property="og:description" content={'Best blog by psytonik'}/>
        <meta property="og:type" content="website"/>
        <meta property="og:url" content={`${DOMAIN}/categories/${query.slug}`}/>
        <meta property="og:site_name" content={`${APP_NAME}`}/>

        <meta property="og:image" content={`${DOMAIN}/static/images/psytonik.jpg`}/>
        <meta property="og:image:secure_url" content={`${DOMAIN}/static/images/psytonik.jpg`}/>
        <meta property="og:image:type" content="image/jpg"/>
        <meta property="fb:app_id" content={`${APP_NAME}`}/>
    </Head>);
    return(
        <Fragment>
            {head()}
            <Layout>
                <main>
                    <div className="container-fluid text-center">
                        <header>
                            <div className="col-md-12 pt-3">
                                <h1 className="display-4 font-weight-bold">
                                    {category.slug}
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
SingleCategory.getInitialProps = ({query}) => {
    return getCategoryBySlug(query.slug).then(data=>{
        if(data.error){
            console.log(data.error)
        }else{
            return {category:data.category,blogs:data.blogs,query}
        }
    })
}
export default SingleCategory;
