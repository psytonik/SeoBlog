import React from 'react';
import Layout from "../../../components/Layout";
import AdminProtection from "../../../components/Auth/AdminProtection";
import {BlogUpdate} from "../../../components/Blog";

const Blog = () => {
    return (
        <Layout>
            <AdminProtection>
                <div className="container-fluid">
                    <h2 className="text-center pt-3 pb-3">Update Blog</h2>
                    <div className="row">
                        <div className="col-md-12">
                            <BlogUpdate />
                        </div>
                    </div>
                </div>
            </AdminProtection>
        </Layout>
    );
};

export default Blog;
