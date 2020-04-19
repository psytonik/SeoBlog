import React,{useState,useEffect,Fragment} from 'react';
import Head from "next/head";
import Link from "next/link";
import {getPublicUserProfile} from '../../service/actions/user'
import Layout from "../../components/Layout";

const AllPublishers = () => {
    return (
        <Layout>
            <div className="container">
                <h3 className="text-center">Professional Idiot's</h3>
            </div>
        </Layout>
    );
};

export default AllPublishers;
