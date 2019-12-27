import React, { Fragment } from 'react';
import { Link } from "react-router-dom";

import '../../css/landing.css';

const Landing = () => {
    return (
        <Fragment>
            <section className="landing">
                <div className="dark-overlay">
                    <div className="landing-inner">
                        <h1 className="x-large">Developer Connector</h1>
                        <p className="lead">
                            Create a developer profile/portfolio, share posts and get help from
                            other developers
                        </p>
                        <div className="buttons">
                            <Link to="/register" className="btn bg-purple text-white mr-2">Sign Up</Link>
                            <Link to="/login" className="btn bg-purple text-white mr-2">Sign In</Link>
                        </div>
                    </div>
               </div>
               
            </section>
        </Fragment>
    )
}

export default Landing


