import Link from 'next/link';
import React from 'react';

const Navbar = () => {
    return (
        <div className='container py-3'>
            <nav className=" navbar navbar-expand-lg ">
                <div className="container">
                    <Link className="navbar-brand fw-bold" href="/">ABC HOSPITAL</Link>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNavAltMarkup"
                        aria-controls="navbarNavAltMarkup"
                        aria-expanded="false"
                        aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                        <div className="navbar-nav ms-auto">
                            <Link className="nav-link fw-bold" href="/">HOME</Link>
                            <Link className="nav-link fw-bold" href="/about">ABOUT US</Link>
                            <Link className="nav-link fw-bold" href="/doctor">DOCTOR</Link>
                            <Link className="nav-link fw-bold" href="/department">DEPARTMENT</Link>
                            <Link className="nav-link fw-bold" href="/serial">TAKE SERIAL</Link>
                            <Link className="nav-link fw-bold" href="/signup">SIGNUP</Link>
                            <Link className="nav-link fw-bold" href="/login">LOGIN</Link>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;