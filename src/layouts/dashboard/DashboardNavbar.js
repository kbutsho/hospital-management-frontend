import Cookies from "js-cookie";
import Link from "next/link";
import styles from "@/styles/dashboardLayout/dashboardLayout.module.css"
import userImage from "@/assets/user.png"
import Image from "next/image";

const DashboardNavbar = () => {
    const name = Cookies.get('name')
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light py-2">
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
                        <span className="nav-link fw-bold text-dark">
                            {name ?? null}
                            <Image src={userImage}
                                className={styles.userImage}
                                height={30} width={30} alt="image" />
                        </span>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default DashboardNavbar;