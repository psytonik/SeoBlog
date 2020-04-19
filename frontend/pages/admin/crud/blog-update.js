import React from 'react';
import Layout from "../../../components/Layout";
import AdminProtection from "../../../components/Auth/AdminProtection";
import {ReadBlog} from "../../../components/Blog";

const BlogUpdate = () => {
    return (
        <Layout>
            <AdminProtection>
                <div className="container">
                    <h2 className="text-center pt-3 pb-3">Update / Delete</h2>
                    <div className="row">
                        <div className="col-md-12">
                            <ReadBlog/>
                        </div>
                    </div>
                </div>
            </AdminProtection>
        </Layout>
    );
};

export default BlogUpdate;
