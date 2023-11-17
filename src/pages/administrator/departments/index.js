import DepartmentList from '@/components/administrator/departments/DepartmentList';
import Breadcrumb from '@/components/breadcrumb';
import AdministratorLayout from '@/layouts/administrator/AdministratorLayout';
import Head from 'next/head';
import React from 'react';

const AdministratorDepartments = () => {
    return (
        <div>
            <Head>
                <title>profile</title>
            </Head>
            <Breadcrumb />
            <div className='px-2'>
                <DepartmentList />
            </div>
        </div>
    );
};

export default AdministratorDepartments;
AdministratorDepartments.getLayout = function getLayout(page) {
    return <AdministratorLayout>{page}</AdministratorLayout>;
};