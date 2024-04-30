import Cookies from "js-cookie";
import styles from "@/styles/dashboardLayout/dashboardLayout.module.css"
import userImage from "@/assets/user.png"
import Image from "next/image";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { config } from "@/config";
import { useSelector } from 'react-redux';
import icon from "../../assets/icon.png"
import Link from "next/link";
import { useEffect, useState } from "react";

const DashboardNavbar = () => {
    const router = useRouter();
    const [name, setName] = useState(Cookies.get('name'));
    const [role, setRole] = useState(Cookies.get('role'));
    const [profile_photo, setProfilePhoto] = useState(Cookies.get('profile_photo'));

    useEffect(() => {
        const updateFromCookies = () => {
            setName(Cookies.get('name'));
            setRole(Cookies.get('role'));
            setProfilePhoto(Cookies.get('profile_photo'));
        };
        const intervalId = setInterval(updateFromCookies, 1000);
        return () => {
            clearInterval(intervalId);
        };
    }, []);

    const handelLogout = () => {
        Cookies.remove('name')
        Cookies.remove('token')
        Cookies.remove('role')
        Cookies.remove('profile_photo')
        router.push('/login')
        toast.success("logout successfully!")
    }
    const info = useSelector(state => state.site_info.data);
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light py-2">
            <div className="container-fluid px-4">
                <div className="navbar-brand d-flex justify-content-between align-items-center fw-bold text-dark" style={{ fontSize: "16px" }}>
                    <Image src={icon} height={60} width={60} alt="icon" />
                    <Link className="navbar-brand fw-bold text-success text-uppercase" href="/">{info?.organization_name}</Link>
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
                        <div className="nav-link fw-bold text-uppercase">
                            {
                                profile_photo && profile_photo !== 'null' ?
                                    <Image
                                        style={{ borderRadius: "30px", marginTop: "4px", marginRight: "0px" }}
                                        src={`${config.backend_api}/uploads/${role === 'administrator' ? 'adminProfile' : role === 'doctor' ? 'doctorProfile' : role === 'assistant' ? 'assistantProfile' : ''}/${profile_photo}`}
                                        className={styles.userImage}
                                        height={36} width={36} alt="image" /> :
                                    <Image
                                        style={{ borderRadius: "30px", marginTop: "4px", marginRight: "0px" }}
                                        src={userImage}
                                        className={styles.userImage}
                                        height={36} width={36} alt="image" />
                            }
                        </div>
                        <div className="nav-link text-uppercase fw-bold text-black" style={{ marginTop: "10px" }}>
                            {name ?? null}
                        </div>
                        <div
                            onClick={handelLogout}
                            className="nav-link fw-bold text-uppercase"
                            style={{ color: "red", cursor: "pointer", marginTop: "10px" }}>
                            Logout
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default DashboardNavbar;