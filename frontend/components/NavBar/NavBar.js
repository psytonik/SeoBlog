import React, {Fragment, useState} from 'react';
import {APP_NAME} from '../../config';
import {isAuth, signOut} from "../../service/actions/auth";
import {Collapse, Nav, Navbar, NavbarToggler, NavItem, NavLink} from 'reactstrap';
import NProgress from 'nprogress';
import Link from "next/link";
import Router from "next/router";
import SearchComponent from "../Blog/Search";

Router.routeChangeStart = url => NProgress.start();
Router.routeChangeComplete = url => NProgress.done();
Router.routeChangeError = url => NProgress.done();

const NavBar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);

    // noinspection HtmlUnknownTarget,HtmlUnknownTarget
    return (
        <Fragment>
            <Navbar color="light" light expand="md">
                <Link href="/">
                    <NavLink style={{ cursor: 'pointer' }} className="font-weight-bold" color="link">{APP_NAME}</NavLink>
                </Link>
                <NavbarToggler onClick={toggle}/>
                <Collapse isOpen={isOpen} navbar>
                    <Nav className="ml-auto" navbar>
                        {isAuth() && isAuth().role === 0 && (
                            <Fragment>
                                <NavItem>
                                    <Link href="/user">
                                        <NavLink style={{ cursor: 'pointer' }} color="link">{isAuth().name} Dashboard</NavLink>
                                    </Link>
                                </NavItem>
                            </Fragment>
                        )}
                        {isAuth() && isAuth().role === 1 && (
                            <Fragment>
                                <NavItem>
                                    <Link href="/admin">
                                        <NavLink style={{ cursor: 'pointer' }} color="link">Admin Area</NavLink>
                                    </Link>
                                </NavItem>
                                <NavItem>
                                    <Link href="/user">
                                        <NavLink style={{ cursor: 'pointer' }} color="link">{isAuth().name} Dashboard</NavLink>
                                    </Link>
                                </NavItem>
                            </Fragment>

                        )}
                        {!isAuth() && (
                            <Fragment>
                                <NavItem>
                                    <Link href="/signup">
                                        <NavLink style={{ cursor: 'pointer' }} color="link">Sign Up</NavLink>
                                    </Link>
                                </NavItem>
                                <NavItem>
                                    <Link href={`/signin`}>
                                        <NavLink style={{ cursor: 'pointer' }} color="link">Sign In</NavLink>
                                    </Link>
                                </NavItem>
                            </Fragment>
                        )}
                        {isAuth() && (<NavItem>
                            <NavLink
                                color="link"
                                style={{cursor: 'pointer'}}
                                onClick={() => signOut(() => Router.replace(`/signin`))}>Sign Out</NavLink>
                        </NavItem>)}
                        <NavItem>
                            <Link href="/blog">
                                <NavLink style={{cursor: 'pointer'}} color="link">Blog</NavLink>
                            </Link>
                        </NavItem>
                        <NavItem>
                            <Link href="/contact">
                                <NavLink style={{cursor: 'pointer'}} color="link">Contact Us</NavLink>
                            </Link>
                        </NavItem>
                    </Nav>
                </Collapse>
            </Navbar>
            <SearchComponent/>
        </Fragment>
    );
};

export default NavBar;
