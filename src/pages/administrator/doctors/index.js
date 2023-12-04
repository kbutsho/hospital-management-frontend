import DoctorList from '@/components/administrator/doctors/DoctorList';
import Breadcrumb from '@/components/breadcrumb';
import AdministratorLayout from '@/layouts/administrator/AdministratorLayout';
import Head from 'next/head';
import { config } from '@/config';

const AdministratorDoctors = () => {
    return (
        <div>
            <Head>
                <title>doctor list</title>
            </Head>
            <Breadcrumb />
            <div className='px-2'>
                <DoctorList />
            </div>
        </div>
    );
};

export default AdministratorDoctors;
AdministratorDoctors.getLayout = function getLayout(page) {
    return <AdministratorLayout>{page}</AdministratorLayout>;
};


