import { authentication } from '@/auth';
import { ROLE } from '@/constant';
import styles from '@/styles/dashboardLayout/dashboardLayout.module.css'
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import DashboardNavbar from '../dashboard/DashboardNavbar';
import Link from 'next/link';
import { BiSolidDashboard } from 'react-icons/bi';


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
    return (
        <div>
            <DashboardNavbar />
            <div className={styles.main}>
                <div className='container'>
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


                            </div>
                        </div>
                        <div className="col-sm-7 col-md-8 col-lg-9 col-12">
                            <div className='bg-light'>
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdministratorLayout;