import Link from 'next/link';
import { useSelector } from 'react-redux';

const Navbar = () => {
    const info = useSelector(state => state.site_info.data);
    return (
        <div>
            <nav className="navbar navbar-expand-lg bg-success px-3 py-3">
                <div className="container">
                    <Link className="navbar-brand fw-bold text-white text-uppercase" href="/">{info?.organization_name}</Link>
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
                            <Link className="nav-link fw-bold text-white" href="/">HOME</Link>
                            <Link className="nav-link fw-bold text-white" href="/about">ABOUT US</Link>
                            <Link className="nav-link fw-bold text-white" href="/our-doctors">DOCTOR</Link>
                            <Link className="nav-link fw-bold text-white" href="/department">DEPARTMENT</Link>
                            <Link className="nav-link fw-bold text-white" href="/serial">SERIAL</Link>
                            <Link className="nav-link fw-bold text-white" href="/contact">CONTACT</Link>
                            <Link className="nav-link fw-bold text-white" href="/signup">SIGNUP</Link>
                            <Link className="nav-link fw-bold text-white" href="/login">LOGIN</Link>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;