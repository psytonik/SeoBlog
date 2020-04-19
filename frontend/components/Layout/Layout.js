import React, {Fragment} from 'react';
import NavBar from "../NavBar";

const Layout = ({children}) => {
    return (
        <Fragment>
            <header>
                <NavBar/>
            </header>
                {children}
            <footer>
            </footer>
        </Fragment>
    );
};

export default Layout;
