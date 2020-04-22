import React from 'react';
import Layout from "../../../components/Layout";
import {BlogUpdate} from "../../../components/Blog";
import PrivateProtection from "../../../components/Auth/PrivateProtection";

const UserBlog = () => {
    return (
        <Layout>
            <PrivateProtection>
                <div className="container-fluid">
                    <h2 className="text-center pt-3 pb-3">Update Blog</h2>
                    <div className="row">
                        <div className="col-md-12">
                            <BlogUpdate/>
                        </div>
                    </div>
                </div>
            </PrivateProtection>
        </Layout>
    );
};

export default UserBlog;
