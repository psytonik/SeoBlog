import React, {Fragment, useState,useEffect} from 'react';
import {Button, Col, Form, FormGroup, Input, Label, Row} from 'reactstrap';
import {preSignUp, signIn, authenticateUser, isAuth} from '../../service/actions/auth';
import Router from 'next/router';
import Spinner from "../Spinner";
import Link from "next/link";

/**
 * Its smart Sign Up and Sign In Component
 * @param props
 * @returns {*}
 * @constructor
 */
const AuthComponent = props => {
    const isLoginPage = props.props === '/signup';

    let pageTitle = isLoginPage ? "Registration Page" : "Login Page";
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: '',
        password2: '',
        error: '',
        loading: false,
        message: '',
        showForm: true
    });
    const {name, email, password, password2, error, loading, message, showForm} = userData;
    const handleSubmit = e => {
        e.preventDefault();
        setUserData({...userData, loading: true, error: ''});
        const user = isLoginPage ? {name, email, password}:{email,password};
        if (password !== password2) {
            setUserData({...userData, error: 'Password do not match', loading: false})
        } else {
            isLoginPage ?
                preSignUp(user)
                .then((data) => {
                    if (data.error) {
                        setUserData({...userData, error: data.error, loading: false})
                    } else {
                        setUserData({
                            ...userData,
                            name: '', email: '', password: '', password2: '', error: '', loading: false,
                            message: data.message, showForm: false
                        })
                    }
                }) :
                signIn(user)
                .then((data)=>{
                    if (data.error){
                        setUserData({...userData, error: data.error, loading: false})
                    } else{
                        /// Save user token to cookie
                        /// Save user info to localstorage
                        /// Authenticate user
                        /// Redirect user to Main Page
                        authenticateUser(data,()=>{
                            if(isAuth() && isAuth().role === 1){
                                Router.push(`/admin`);
                            }else{
                                Router.push(`/user`);
                            }
                        })
                    }
                })
        }
    };
    const handleChange = name => e => {
        setUserData({...userData, error: '', [name]: e.target.value})
    };
    const showLoading = () => (loading ? <Spinner/>: '');
    const showError = () => (error ? <div className="alert alert-danger">{error}</div> : '');
    const showMessage = () => (message ? <div className="alert alert-info">{message}</div> : '');
    const authForm = () => {
        return (
            <Form onSubmit={handleSubmit}>
                {isLoginPage ? (
                    <Fragment>
                        <FormGroup>
                            <Label for="name">Name</Label>
                            <Input onChange={handleChange('name')}
                                   value={name}
                                   require="true"
                                   type="text" name="name" id="name" placeholder="Your Name"/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="email">Email</Label>
                            <Input onChange={handleChange('email')}
                                   value={email}
                                   require="true"
                                   type="email" name="email" id="email"
                                   placeholder="email@something.com"/>
                        </FormGroup>
                        <Row form>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="password">Password</Label>
                                    <Input onChange={handleChange('password')}
                                           value={password}
                                           require="true"
                                           type="password" name="password" id="password"
                                           placeholder="Password"/>
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="password">Password Verify</Label>
                                    <Input onChange={handleChange('password2')}
                                           value={password2}
                                           require="true"
                                           type="password" name="password2" id="password2"
                                           placeholder="Password Verify"/>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Button color="primary">
                            Sign Up
                        </Button>
                    </Fragment>
                ) : (
                    <Fragment>
                        <FormGroup>
                            <Label for="email">Email</Label>
                            <Input onChange={handleChange('email')}
                                   value={email}
                                   require="true"
                                   type="email" name="email" id="email"
                                   placeholder="email@something.com"/>
                        </FormGroup>
                        <Row form>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="password">Password</Label>
                                    <Input onChange={handleChange('password')}
                                           value={password}
                                           require="true"
                                           type="password" name="password" id="password"
                                           placeholder="Password"/>
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="password">Password Verify</Label>
                                    <Input onChange={handleChange('password2')}
                                           value={password2}
                                           require="true"
                                           type="password" name="password2" id="password2"
                                           placeholder="Password Verify"/>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Button color="outline-primary">
                            Sign In
                        </Button>
                        <hr/>
                        <div className="mt-2">
                            <Link href='/auth/password/forgotpassword'>
                                <a>Forget Password</a>
                            </Link>
                        </div>
                    </Fragment>
                )}
            </Form>
        )
    };
    useEffect(()=>{
        isAuth() && Router.push(`/`)
    },[]);
    return (
        <Fragment>
            <h2 className="text-center pt-4 pb-4">{pageTitle}</h2>
            {showError()}
            {showLoading()}
            {showMessage()}
            {showForm && authForm()}
        </Fragment>
    );
};

export default AuthComponent;
