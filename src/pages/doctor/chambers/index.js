import Breadcrumb from '@/components/breadcrumb';
import ChamberList from '@/components/doctor/chambers/ChamberList';
import DoctorLayout from '@/layouts/doctor/DoctorLayout';
import Head from 'next/head';
import React from 'react';

const DoctorChambers = () => {
    return (
        <div>
            <Head>
                <title>profile</title>
            </Head>
            <Breadcrumb />
            <div className='px-2'>
                <ChamberList />
            </div>
        </div>
    );
};

export default DoctorChambers;
DoctorChambers.getLayout = function getLayout(page) {
    return <DoctorLayout>{page}</DoctorLayout>;
};