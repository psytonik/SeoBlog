import React, {useState} from 'react';
import Layout from "../../../components/Layout";
import {withRouter} from "next/router";
import {resetPassword} from "../../../service/actions/auth";
import {Button, Form, FormGroup, Input, Label} from "reactstrap";
import Link from "next/link";

const ResetPassword = ({router}) => {

    const [values, setValues] = useState({
        name: '',
        newPassword: '',
        error: '',
        message: '',
        showForm: true
    })
    const {newPassword, showForm, message, error} = values;
    const handleChange = name => e => {
        setValues({...values, message: '', error: '', [name]: e.target.value})
    };

    const handleSubmit = e => {
        e.preventDefault();
        resetPassword({newPassword, resetPasswordLink: router.query.id})
            .then(data => {
                if (data.error) {
                    setValues({...values, error: data.error, showForm: false, newPassword: ''})
                } else {
                    setValues({...values, message: data.message, showForm: false, newPassword: '', error: ''})
                }

            })
    };

    const showResetForm = () => {
        return (
            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label>Email</Label>
                    <Input type="password" name="password"
                           onChange={e => setValues({...values, newPassword: e.target.value})} value={newPassword}
                           placeholder="Type New Password" required/>
                </FormGroup>
                <Button type="submit">Change Password</Button>
            </Form>
        )
    }
    return (
        <Layout>
            <div className="container">
                <h2 className="text-center">Reset Password Form</h2>
                {error ? <div className="alert alert-danger">{error}</div> : ''}
                {message ? <div className="alert alert-success">{message}</div> : ''}
                {showForm && showResetForm()}
                <hr/>
                <div className="mt-2">
                    <Link href='/auth/password/forgotpassword'>
                        <a>Forget Password</a>
                    </Link>
                </div>
            </div>
        </Layout>
    );
};

export default withRouter(ResetPassword);
