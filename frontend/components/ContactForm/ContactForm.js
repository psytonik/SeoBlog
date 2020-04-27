import React, {Fragment, useState, useEffect} from 'react';
import {Form, FormGroup, Input, Button, Label} from "reactstrap";
import Link from "next/link";
import {sendContactMessage} from '../../service/actions/contactForm'

const ContactForm = ({authorEmail}) => {
    const [values, setValues] = useState({
        name: '',
        email: '',
        message: '',
        error: false,
        success: false,
        sent: false,
        buttonText: 'Send Message'
    });
    const {name, email, message, error, success, sent, buttonText} = values;

    const handleChange = name => e => {
        const value = e.target.value;
        setValues({...values, [name]: value, error: false, success: false, buttonText: 'Send Message'})
    };

    const clickSubmit = e => {
        e.preventDefault();
        setValues({...values, buttonText: 'Sending...'});
        sendContactMessage({authorEmail, name, email, message})
            .then(data => {
                if (data && data.error) {
                    setValues({...values, error: data.error})
                } else {
                    setValues({
                        ...values,
                        sent: true,
                        name: '',
                        email: '',
                        message: '',
                        error: false,
                        success: data.success,
                        buttonText: 'Sent'
                    })
                }
            })
    };
    const showError = () => {
        return error && (
            <div className="alert alert-danger" style={{display: error ? '' : 'none'}}>{error}</div>
        )
    };

    const showSuccess = () => {
        return success && (
            <div className="alert alert-success" style={{display: success ? '' : 'none'}}>Thank You for contacting
                us.</div>
        )
    };
    return (
        <Fragment>
            <div className="container-fluid mt-3">
                {showSuccess()}
                {showError()}
            </div>
            <Form onSubmit={e => clickSubmit(e)}>
                <FormGroup>
                    <Label className="text-muted">Full Name</Label>
                    <Input type="text" onChange={handleChange('name')} value={name} required/>
                </FormGroup>
                <FormGroup>
                    <Label className="text-muted">Email Address</Label>
                    <Input type="email" onChange={handleChange('email')} value={email} required/>
                </FormGroup>
                <FormGroup>
                    <Label className="text-muted">Message</Label>
                    <Input type="textarea" onChange={handleChange('message')} value={message} required rows={10}/>
                </FormGroup>
                <Button type="submit" color="outline-primary">{buttonText}</Button>
            </Form>
        </Fragment>
    );
};

export default ContactForm;
