import React from 'react';
import Layout from "../../../components/Layout";
import {CreateBlog} from "../../../components/Blog";
import PrivateProtection from "../../../components/Auth/PrivateProtection";

const Blogcreate = () => {
    return (
        <Layout>
            <PrivateProtection>
                <div className="container-fluid">
                    <h2 className="text-center pt-3 pb-3">Manage Blog</h2>
                    <div className="row">
                        <div className="col-md-12">
                            <CreateBlog/>
                        </div>
                    </div>
                </div>
            </PrivateProtection>
        </Layout>
    );
};

export default Blogcreate;
