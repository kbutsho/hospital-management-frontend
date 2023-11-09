import AdministratorLayout from '@/layouts/administrator/AdministratorLayout';
import Head from 'next/head';
import React from 'react';

const AdminDashboard = () => {
    return (
        <div >
            <Head>
                <title>dashboard</title>
            </Head>
            {/* <Breadcrumb /> */}
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
                <h5 className="fw-bold text-danger">admin dashboard</h5>
            </div>
        </div>
    );
};

export default AdminDashboard;
AdminDashboard.getLayout = function getLayout(page) {
    return <AdministratorLayout>{page}</AdministratorLayout>;
};