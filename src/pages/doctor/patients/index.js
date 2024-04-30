import Breadcrumb from '@/components/breadcrumb';
import PatientList from '@/components/doctor/patient/PatientList';
import DoctorLayout from '@/layouts/doctor/DoctorLayout';
import Head from 'next/head';
import React from 'react';

const DoctorPatients = () => {
    return (
        <div>
            <Head>
                <title>patients list</title>
            </Head>
            <Breadcrumb />
            <div className='px-2'>
                <PatientList />
            </div>
        </div>
    );
};

export default DoctorPatients;
DoctorPatients.getLayout = function getLayout(page) {
    return <DoctorLayout>{page}</DoctorLayout>;
};