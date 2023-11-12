import AdministratorLayout from '@/layouts/administrator/AdministratorLayout';
import Head from 'next/head';
import React from 'react';

const AdministratorAssistants = () => {
    return (
        <div >
            <Head>
                <title>assistants list</title>
            </Head>
            {/* <Breadcrumb /> */}
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
                <h5 className="fw-bold text-danger">assistant list</h5>
            </div>
        </div>
    );
};

export default AdministratorAssistants;
AdministratorAssistants.getLayout = function getLayout(page) {
    return <AdministratorLayout>{page}</AdministratorLayout>;
};