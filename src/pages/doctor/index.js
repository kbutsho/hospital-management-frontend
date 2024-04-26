import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

const Doctor = () => {
    const router = useRouter();
    useEffect(() => {
        router.replace('/doctor/profile');
    }, []);
    return (
        <div>
            <Head>
                <title>profile</title>
            </Head>
        </div>
    )
};

export default Doctor;