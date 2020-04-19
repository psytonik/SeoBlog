import React from 'react';
import Layout from "../../../components/Layout";
import AdminProtection from "../../../components/Auth/AdminProtection";
import {CreateBlog} from "../../../components/Blog";

const Blog = () => {
    return (
        <Layout>
            <AdminProtection>
                <div className="container-fluid">
                    <h2 className="text-center pt-3 pb-3">Manage Blog</h2>
                    <div className="row">
                        <div className="col-md-12">
                            <CreateBlog />
                        </div>
                    </div>
                </div>
            </AdminProtection>
        </Layout>
    );
};

export default Blog;
