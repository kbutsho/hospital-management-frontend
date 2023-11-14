import AdministratorDoctorList from '@/components/administrator/doctors/AdministratorDoctorList';
import Breadcrumb from '@/components/breadcrumb';
import AdministratorLayout from '@/layouts/administrator/AdministratorLayout';
import Head from 'next/head';
import React from 'react';

const AdministratorDoctors = () => {
    return (
        <div >
            <Head>
                <title>doctor list</title>
            </Head>
            <Breadcrumb />
            <div className=' px-2'>
                <AdministratorDoctorList />
            </div>
        </div>
    );
};

export default AdministratorDoctors;
AdministratorDoctors.getLayout = function getLayout(page) {
    return <AdministratorLayout>{page}</AdministratorLayout>;
};