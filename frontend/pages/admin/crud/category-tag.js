import React from 'react';
import Layout from "../../../components/Layout";
import AdminProtection from "../../../components/Auth/AdminProtection";
import Link from "next/link";
import Category from "../../../components/Category";
import Tags from "../../../components/Tags";

const CategoryTag = () => {
    return (
        <Layout>
            <AdminProtection>
                <div className="container-fluid">
                    <h2 className="text-center pt-3 pb-3">Manage Category and Tags</h2>
                    <div className="row">
                        <div className="col-md-6">
                            <Category/>
                        </div>
                        <div className="col-md-6">
                            <Tags/>
                        </div>
                    </div>
                </div>
            </AdminProtection>
        </Layout>
    );
};

export default CategoryTag;
