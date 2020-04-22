import React from 'react';
import Layout from "../../../components/Layout";
import PrivateProtection from "../../../components/Auth/PrivateProtection";
import {ReadBlog} from "../../../components/Blog";
import {isAuth} from "../../../service/actions/auth";

const UserBlogUpdate = () => {
    const username = isAuth() && isAuth().username;
    return (
        <Layout>
            <PrivateProtection>
                <div className="container">
                    <h2 className="text-center pt-3 pb-3">Update / Delete</h2>
                    <div className="row">
                        <div className="col-md-12">
                            <ReadBlog username={username}/>
                        </div>
                    </div>
                </div>
            </PrivateProtection>
        </Layout>
    );
};

export default UserBlogUpdate;
