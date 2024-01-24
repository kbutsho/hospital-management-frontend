import Cookies from "js-cookie";
import styles from "@/styles/dashboardLayout/dashboardLayout.module.css"
import userImage from "@/assets/user.png"
import Image from "next/image";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const DashboardNavbar = () => {
    const router = useRouter();
    const name = Cookies.get('name')
    const handelLogout = () => {
        Cookies.remove('name')
        Cookies.remove('token')
        Cookies.remove('role')
        router.push('/login')
        toast.success("logout successfully!")
    }
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light py-2">
            <div className="container">
                <div className="navbar-brand d-flex justify-content-between fw-bold text-dark">
                    <Image src={userImage}
                        className={styles.userImage}
                        height={30} width={30} alt="image" />
                    <div>{name ?? null}</div>
                </div>
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
                        <div
                            onClick={handelLogout}
                            className="nav-link fw-bold text-uppercase"
                            style={{ color: "red", cursor: "pointer" }}>
                            Logout
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default DashboardNavbar;