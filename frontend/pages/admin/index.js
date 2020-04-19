import React from 'react';
import Layout from "../../components/Layout";
import AdminProtection from "../../components/Auth/AdminProtection";
import Link from "next/link";

const AdminDashboard = () => {
    return (
            <Layout>
                <AdminProtection>
                    <div className="container-fluid">
                        <h2 className="text-center pt-3 pb-3">Admin Dashboard</h2>
                        <div className="row">
                            <div className="col-md-2">
                                <ul className="list-group">
                                    <li className="list-group-item">
                                        <Link href="/admin/crud/category-tag">
                                            <a>Create Category</a>
                                        </Link>
                                    </li>
                                    <li className="list-group-item">
                                        <a href="/admin/crud/category-tag">Create Tags</a>
                                    </li>
                                    <li className="list-group-item">
                                        <Link href="/admin/crud/blog">
                                            <a>Create Blog</a>
                                        </Link>
                                    </li>
                                    <li className="list-group-item">
                                        <Link href="/admin/crud/blog-update">
                                            <a>Update/Delete Blog</a>
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                            <div className="col-md-10">
                                right
                            </div>
                        </div>
                    </div>
                </AdminProtection>
            </Layout>
    );
};

export default AdminDashboard;
