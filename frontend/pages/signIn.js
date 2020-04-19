import React from 'react';
import Layout from "../components/Layout";
import {withRouter} from "next/router";
import AuthComponent from "../components/Auth/AuthComponent";

const SignIn = ({router}) => {
    return (

            <Layout>
                <div className="container">
                    <AuthComponent props={router.route}/>
                </div>
            </Layout>

    );
};

export default withRouter(SignIn);
