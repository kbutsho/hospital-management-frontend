import Breadcrumb from '@/components/breadcrumb';
import AdministratorLayout from '@/layouts/administrator/AdministratorLayout';
import Head from 'next/head';
import React from 'react';

const AdministratorProfile = () => {
    return (
        <div>
            <Head>
                <title>profile</title>
            </Head>
            <Breadcrumb />
            <div className={`row py-3 px-2`} style={{ minHeight: "70vh" }}>
                hello
            </div>
        </div>
    );
};

export default AdministratorProfile;
AdministratorProfile.getLayout = function getLayout(page) {
    return <AdministratorLayout>{page}</AdministratorLayout>;
};