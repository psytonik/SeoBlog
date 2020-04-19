import React, {Fragment, useEffect} from 'react';
import Router from 'next/router';
import {isAuth} from "../../service/actions/auth";

const AdminProtection = ({children}) => {
    useEffect(()=>{
        if(!isAuth()){
            Router.push('/signin')
        }else if (isAuth().role !== 1){
            Router.push('/')
        }
    },[]);
    return <Fragment>{children}</Fragment>
};

export default AdminProtection;
