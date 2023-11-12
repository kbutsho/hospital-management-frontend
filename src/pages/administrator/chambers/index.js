import Breadcrumb from '@/components/breadcrumb';
import AdministratorLayout from '@/layouts/administrator/AdministratorLayout';
import Head from 'next/head';
import React from 'react';

const AdministratorChambers = () => {
    return (
        <div >
            <Head>
                <title>dashboard</title>
            </Head>
            <Breadcrumb />
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
                <h5 className="fw-bold text-danger">admin dashboard</h5>
            </div>
        </div>
    );
};

export default AdministratorChambers;
AdministratorChambers.getLayout = function getLayout(page) {
    return <AdministratorLayout>{page}</AdministratorLayout>;
};