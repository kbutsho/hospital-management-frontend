import SpecializationList from '@/components/administrator/specialization/SpecializationList';
import Breadcrumb from '@/components/breadcrumb';
import AdministratorLayout from '@/layouts/administrator/AdministratorLayout';
import Head from 'next/head';
import React from 'react';

const AdministratorSpecialization = () => {
    return (
        <div>
            <Head>
                <title>profile</title>
            </Head>
            <Breadcrumb />
            <div className='px-2'>
                <SpecializationList />
            </div>
        </div>
    );
};

export default AdministratorSpecialization;
AdministratorSpecialization.getLayout = function getLayout(page) {
    return <AdministratorLayout>{page}</AdministratorLayout>;
};