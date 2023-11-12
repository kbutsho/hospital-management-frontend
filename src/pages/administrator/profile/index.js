import AdministratorLayout from '@/layouts/administrator/AdministratorLayout';
import Head from 'next/head';
import React from 'react';

const AdministratorProfile = () => {
    return (
        <div >
            <Head>
                <title>profile</title>
            </Head>
            {/* <Breadcrumb /> */}
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
                <h5 className="fw-bold text-danger">admin profile</h5>
            </div>
        </div>
    );
};

export default AdministratorProfile;
AdministratorProfile.getLayout = function getLayout(page) {
    return <AdministratorLayout>{page}</AdministratorLayout>;
};