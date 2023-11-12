import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

const Administrator = () => {
    const router = useRouter();
    useEffect(() => {
        router.replace('/administrator/dashboard');
    }, []);
    return (
        <div>
            <Head>
                <title>dashboard</title>
            </Head>
        </div>
    )
};

export default Administrator;