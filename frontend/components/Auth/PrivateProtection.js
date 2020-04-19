import React, {Fragment, useEffect} from 'react';
import Router from 'next/router';
import {isAuth} from "../../service/actions/auth";

const PrivateProtection = ({children}) => {
    useEffect(()=>{
        if(!isAuth()){
            Router.push('/signin')
        }
    },[]);
    return <Fragment>{children}</Fragment>
};

export default PrivateProtection;
