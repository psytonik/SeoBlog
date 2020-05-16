import React, {useState, useEffect} from 'react';
import {Button} from "reactstrap";
import Link from "next/link";
import {withRouter} from "next/router";
import jwt from 'jsonwebtoken';

import Layout from '../../../../components/Layout';
import {signUp} from "../../../../service/actions/auth";
import Spinner from "../../../../components/Spinner";


const ActivateAccount = ({router}) => {
    const [values, setValues] = useState({
        name: '',
        token: '',
        error: '',
        loading: false,
        success: false,
        showButton: true
    });
    const {name, token, error, loading, success, showButton} = values;
    useEffect(() => {
        let token = router.query.id;
        if (token) {
            const {name} = jwt.decode(token);
            setValues({...values, name, token})
        }
    }, [router]);
    const clickSubmit = e => {
        e.preventDefault();
        setValues({...values, loading: true, error: ''})
        signUp({token})
            .then(data => {
                if (data.error) {
                    setValues({...values, error: data.error, loading: false, showButton: false})
                } else {
                    setValues({...values, loading: false, success: true, showButton: false})
                }
            })
    }
    const showLoading = () => (loading ? (<Spinner/>) : '');

    return (
        <Layout>
            <div className="container">
                <h3 className="pb-4">Hey {name}, Ready to activate your account ?</h3>
                {showLoading()}
                {error && error}
                {success && (<div>
                    <p className="text-lead">You have successfully activate your account, Please Sign In</p>
                    <Link href={'/signin'}>
                        Sign In
                    </Link>
                </div>)}
                {showButton && <Button onClick={clickSubmit}>Activate Account</Button>}
            </div>
        </Layout>
    );
};

export default withRouter(ActivateAccount);
