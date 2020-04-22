import React from 'react';
import Layout from "../../components/Layout";
import PrivateProtection from "../../components/Auth/PrivateProtection";
import {isAuth} from "../../service/actions/auth";
import Link from "next/link";

const UserIndex = () => {
    return (
            <Layout>
                <PrivateProtection>
                    <div className="container-fluid">
                        <h2><small>{isAuth() && isAuth().name}'s</small> Dashboard</h2>
                        <div className="row">
                            <div className="col-md-2">
                                <ul className="list-group">
                                    <li className="list-group-item">
                                        <Link href="/user/crud/blogcreate">
                                            <a>Create Blog</a>
                                        </Link>
                                    </li>
                                    <li className="list-group-item">
                                        <Link href="/user/crud/blog-update">
                                            <a>Update/Delete Blog</a>
                                        </Link>
                                    </li>
                                    <li className="list-group-item">
                                        <Link href="/user/edit">
                                            <a>Update Profile</a>
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                            <div className="col-md-10">
                                right
                            </div>
                        </div>
                    </div>

                </PrivateProtection>
            </Layout>
    );
};

export default UserIndex;
