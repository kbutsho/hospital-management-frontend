import Breadcrumb from '@/components/breadcrumb';
import DoctorLayout from '@/layouts/doctor/DoctorLayout';
import Head from 'next/head';
import React from 'react';

const DoctorAssistants = () => {
    return (
        <div >
            <Head>
                <title>assistants list</title>
            </Head>
            <Breadcrumb />
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "70vh" }}>
                <h5 className="fw-bold text-danger">assistant list</h5>
            </div>
        </div>
    );
};

export default DoctorAssistants;
DoctorAssistants.getLayout = function getLayout(page) {
    return <DoctorLayout>{page}</DoctorLayout>;
};