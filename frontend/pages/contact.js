import React from 'react';
import Layout from "../components/Layout";
import Link from "next/link";
import {Row, Col} from 'reactstrap'
import ContactForm from "../components/ContactForm";

const ContactPage = () => {
    return (
        <Layout>
            <div className="container-fluid">
                <Row>
                    <Col md={8}>
                        <h1 className="text-center">Contact Us</h1>
                        <hr/>
                        <ContactForm/>
                    </Col>
                    <Col md={4}>

                    </Col>
                </Row>
            </div>
        </Layout>
    );
};

export default ContactPage;
