import React, {Fragment} from 'react';
import Head from "next/head";
import Link from "next/link";
import {getPublicUserProfile} from '../../service/actions/user'
import Layout from "../../components/Layout";
import {API, APP_NAME, DOMAIN} from "../../config";
import moment from "moment";
import {Card, CardBody, Col, Row} from "reactstrap";

const PublicUseProfile = ({user, blogs}) => {
    const head = () => (<Head>
        <title>{user.name} | {APP_NAME}</title>
        <meta name="description" content={`Articles by ${user.name}`}/>
        <link rel="canonical" href={`${DOMAIN}/profile/${user.username}`}/>
        <meta property="og:title" content={`${user.name} | ${APP_NAME}`}/>
        <meta property="og:description" content={`Articles by ${user.name}`}/>
        <meta property="og:type" content="website"/>
        <meta property="og:url" content={`${DOMAIN}/profile/${user.username}`}/>
        <meta property="og:site_name" content={`${APP_NAME}`}/>

        <meta property="og:image" content={`${DOMAIN}/static/images/psytonik.jpg`}/>
        <meta property="og:image:secure_url" content={`${DOMAIN}/static/images/psytonik.jpg`}/>
        <meta property="og:image:type" content="image/jpg"/>
        <meta property="fb:app_id" content={`${APP_NAME}`}/>
    </Head>);

    const showUserBlogs = () => {
        return blogs.map((blog, i) => {
            return (
                <div className="mt-4 mb-4" key={i}>
                    <Link href={`/blog/${blog.slug}`}>
                        <a className="lead">{blog.title}</a>
                    </Link>
                </div>
            )
        })
    }
    return (
        <Fragment>
            {head()}
            <Layout>
                <div className="container">
                    <Card>
                        <CardBody>
                            <Row>
                                <Col md={4}>
                                    <img src={`${API}/user/photo/${user.username}`}
                                         alt={user.name}
                                         style={{maxHeight: 'auto', maxWidth: '100%'}}
                                         className="img img-fluid img-thumbnail mb-3"
                                    />
                                </Col>
                                <Col md={8}>

                                    <h5>{user.name}</h5>
                                    <p className="muted-text">{user.about}</p>
                                    <h6 className="text-muted">Joined {moment(user.createdAt).fromNow()}</h6>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </div>
                <br/>
                <div className="container pb-5">
                    <Row>
                        <Col md={6}>
                            <Card>
                                <CardBody>
                                    <h5 className="card-title bg-primary pt-4 pb-4 pl-4 pr-4 text-white">
                                        Recent Article's by {user.name}
                                    </h5>
                                    <h6>{showUserBlogs()}</h6>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col md={6}>
                            <Card>
                                <CardBody>
                                    <h5 className="card-title bg-primary pt-4 pb-4 pl-4 pr-4 text-white">
                                        Message {user.name}
                                    </h5>
                                    <br/>
                                    <h6>Contact Form</h6>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </Layout>
        </Fragment>
    )
}
PublicUseProfile.getInitialProps = ({query}) => {
    const username = query.username;
    return getPublicUserProfile(username)
        .then(data => {
            if (data.error) {
                console.error(data.error)
            } else {
                return {user: data.user, blogs: data.blogs}
            }
        })
}
export default PublicUseProfile;
