import { authentication } from '@/auth';
import { ROLE } from '@/constant';
import styles from '@/styles/dashboardLayout/dashboardLayout.module.css'
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import DashboardNavbar from '../dashboard/DashboardNavbar';
import Link from 'next/link';
import { BiSolidDashboard } from 'react-icons/bi';
import { ImSwitch } from 'react-icons/im';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import DashboardFooter from '../dashboard/DashboardFooter';


const AdministratorLayout = ({ children }) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const toastShownRef = useRef(false);
    useEffect(() => {
        authentication(setLoading, router, toastShownRef, ROLE.ADMINISTRATOR);
    }, [setLoading, router, toastShownRef, ROLE]);
    if (loading) {
        return null;
    }
    const isActive = (route) => router.pathname === route;
    const handelLogout = () => {
        Cookies.remove('name')
        Cookies.remove('token')
        Cookies.remove('role')
        router.push('/login')
        toast.success("logout successfully!")
    }
    return (
        <div>
            <DashboardNavbar />
            <div className={styles.main}>
                <div className={styles.body}>
                    <div className="row">
                        <div className="col-sm-5 col-md-4 col-lg-3 col-12 mb-4">
                            <div className='bg-light shadow-sm p-3 rounded-1'>
                                <Link href="/administrator/dashboard"
                                    className={`${styles.sidebarMenu} 
                                    ${isActive('/administrator/dashboard') ? styles.activeMenu : ''}`}>
                                    <div className={styles.sidebarMenuIcon}>
                                        <BiSolidDashboard />
                                    </div>
                                    <div className={styles.sidebarMenuLink}>
                                        <span>Dashboard</span>
                                    </div>
                                </Link>

                                <Link href="/administrator/profile"
                                    className={`${styles.sidebarMenu} 
                                    ${isActive('/administrator/profile') ? styles.activeMenu : ''}`}>
                                    <div className={styles.sidebarMenuIcon}>
                                        <BiSolidDashboard />
                                    </div>
                                    <div className={styles.sidebarMenuLink}>
                                        <span>Profile</span>
                                    </div>
                                </Link>

                                <Link href="/administrator/doctors"
                                    className={`${styles.sidebarMenu} 
                                    ${isActive('/administrator/doctors') ? styles.activeMenu : ''}`}>
                                    <div className={styles.sidebarMenuIcon}>
                                        <BiSolidDashboard />
                                    </div>
                                    <div className={styles.sidebarMenuLink}>
                                        <span>Doctors</span>
                                    </div>
                                </Link>

                                <Link href="/administrator/assistants"
                                    className={`${styles.sidebarMenu} 
                                    ${isActive('/administrator/assistants') ? styles.activeMenu : ''}`}>
                                    <div className={styles.sidebarMenuIcon}>
                                        <BiSolidDashboard />
                                    </div>
                                    <div className={styles.sidebarMenuLink}>
                                        <span>Assistants</span>
                                    </div>
                                </Link>

                                <Link href="/administrator/chambers"
                                    className={`${styles.sidebarMenu} 
                                    ${isActive('/administrator/chambers') ? styles.activeMenu : ''}`}>
                                    <div className={styles.sidebarMenuIcon}>
                                        <BiSolidDashboard />
                                    </div>
                                    <div className={styles.sidebarMenuLink}>
                                        <span>Chambers</span>
                                    </div>
                                </Link>

                                <span
                                    onClick={handelLogout}
                                    className={styles.sidebarLogoutMenu}>
                                    <div className={styles.sidebarLogoutMenuIcon}>
                                        <ImSwitch />
                                    </div>
                                    <div className={styles.sidebarLogoutMenuLink}>
                                        <span>Logout</span>
                                    </div>
                                </span>
                            </div>
                        </div>
                        <div className="col-sm-7 col-md-8 col-lg-9 col-12">
                            <div className='bg-light shadow-sm p-3 rounded-1'>
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <DashboardFooter />
        </div>
    );
};

export default AdministratorLayout;