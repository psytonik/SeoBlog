import React from 'react';
import Layout from "../../components/Layout";
import PrivateProtection from "../../components/Auth/PrivateProtection";
import {Row} from "reactstrap";
import {ProfileUpdateComponent} from "../../components/Profile";

const EditUser = () => {
    return (
        <Layout>
            <PrivateProtection>
                <div className="container-fluid">
                    <h2>Update Profile</h2>
                    <Row>
                        <ProfileUpdateComponent/>
                    </Row>
                </div>
            </PrivateProtection>
        </Layout>
    );
};

export default EditUser;
