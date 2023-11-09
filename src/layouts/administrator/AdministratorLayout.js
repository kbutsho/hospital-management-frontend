import { ROLE } from '@/constant';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

const AdministratorLayout = ({ children }) => {
    const router = useRouter();
    const token = Cookies.get('token');
    const userRole = Cookies.get('userRole');
    const [isLoading, setIsLoading] = useState(true);
    const toastShownRef = useRef(false);
    useEffect(() => {
        if (!token || userRole !== ROLE.ADMINISTRATOR) {
            router.push('/login');
            if (!toastShownRef.current) {
                toast.info('login as administrator!');
                toastShownRef.current = true;
            }
        } else {
            setIsLoading(false);
        }
    }, [token, userRole, router]);
    if (isLoading) {
        return <div style={{ height: "100vh" }}></div>;
    }
    return (
        <div className='container'>
            <div className="row">
                <div className="col-md-3">
                    <h3>menu</h3>
                    {/* {token} */}
                    {userRole}
                </div>
                <div className="col-md-9">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AdministratorLayout;