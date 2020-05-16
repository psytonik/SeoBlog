import React, {useState} from 'react';
import Layout from "../../../components/Layout";
import {forgotPassword} from "../../../service/actions/auth";
import {Form, FormGroup, Input, Label, Button} from "reactstrap";

const ForgotPassword = () => {
    const [values, setValues] = useState({
        email: '',
        message: '',
        error: '',
        showForm: true
    })
    const {email, message, showForm, error} = values;

    const handleChange = name => e => {
        setValues({...values, message: '', error: '', [name]: e.target.value})
    };

    const handleSubmit = e => {
        e.preventDefault();
        setValues({...values, message: '', error: ''})
        forgotPassword({email})
            .then(data => {
                console.log(data)
                if (data.error) {
                    setValues({...values, error: data.error})
                } else {
                    setValues({...values, email: '', error: '', message: data.message, showForm: false})
                }

            })
    };

    const showError = () => (error ? <div className="alert alert-danger">{error}</div> : '');
    const showMessage = () => (message ? <div className="alert alert-success">{message}</div> : '');
    const showForgotForm = () => {
        return (
            <div className="container">
                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label>Email</Label>
                        <Input type="email" name="email" onChange={handleChange('email')} value={email}
                               placeholder="Type your email" required/>
                    </FormGroup>
                    <Button type="submit">Send password reset link</Button>
                </Form>
            </div>
        )
    }
    return (
        <Layout>
            <div className="container">
                <h2 className="text-center">Forgot Password Form</h2>
                {showError()}
                {showMessage()}
                {showForm && showForgotForm()}
            </div>
        </Layout>
    );
};

export default ForgotPassword;
