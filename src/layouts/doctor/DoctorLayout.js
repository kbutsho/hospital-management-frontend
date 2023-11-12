import { authentication } from '@/auth';
import { ROLE } from '@/constant';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';


const DoctorLayout = ({ children }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const toastShownRef = useRef(false);
    useEffect(() => {
        authentication(setIsLoading, router, toastShownRef, ROLE.DOCTOR);
    }, [setIsLoading, router, toastShownRef, ROLE]);
    if (isLoading) {
        return null;
    }
    return (
        <div className='container'>
            <div className="row">
                <div className="col-md-3">
                    <h3>menu</h3>
                </div>
                <div className="col-md-9">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default DoctorLayout;