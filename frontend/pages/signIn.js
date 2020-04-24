import React from 'react';
import Layout from "../components/Layout";
import {withRouter} from "next/router";
import AuthComponent from "../components/Auth/AuthComponent";

const SignIn = ({router}) => {
    const showRedirect = () => {
        if (router.query.message) {
            return (
                <div className="alert alert-danger text-center">
                    {router.query.message}
                </div>
            )
        }
    }
    return (

        <Layout>
            <div className="container">
                {showRedirect()}
                <AuthComponent props={router.route}/>
            </div>
        </Layout>

    );
};

export default withRouter(SignIn);
