import AdministratorLayout from '@/layouts/administrator/AdministratorLayout';
import Head from 'next/head';
import React from 'react';

const AdministratorDoctors = () => {
    return (
        <div >
            <Head>
                <title>doctor list</title>
            </Head>
            {/* <Breadcrumb /> */}
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
                <h5 className="fw-bold text-danger">doctor list</h5>
            </div>
        </div>
    );
};

export default AdministratorDoctors;
AdministratorDoctors.getLayout = function getLayout(page) {
    return <AdministratorLayout>{page}</AdministratorLayout>;
};