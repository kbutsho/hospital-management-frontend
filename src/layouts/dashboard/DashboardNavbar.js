import Cookies from "js-cookie";
import Link from "next/link";

const DashboardNavbar = () => {
    const name = Cookies.get('name')
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light py-3">
            <div className="container">
                <Link className="navbar-brand fw-bold px-3"
                    href="/">Hospital Management
                </Link>
                <button
                    type="button"
                    className="navbar-toggler"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNavAltMarkup"
                    aria-controls="navbarNavAltMarkup"
                    aria-expanded="false"
                    aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div
                    className="collapse navbar-collapse"
                    id="navbarNavAltMarkup">
                    <div className="navbar-nav ms-auto">
                        <div className="dropdown">
                            <span className="btn btn-outline-secondary fw-bold dropdown-toggle"
                                data-bs-toggle="dropdown"
                                aria-expanded="false">
                                {name ?? null}
                            </span>
                            <ul className="dropdown-menu">
                                <li><Link className="dropdown-item" href="/login">logout</Link></li>
                            </ul>
                        </div>
                        <span className="nav-link"></span>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default DashboardNavbar;