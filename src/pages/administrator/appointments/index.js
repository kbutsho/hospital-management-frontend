import AppointmentList from '@/components/administrator/appointment/AppointmentList';
import Breadcrumb from '@/components/breadcrumb';
import AdministratorLayout from '@/layouts/administrator/AdministratorLayout';
import Head from 'next/head';

const AdministratorAppointment = () => {
    return (
        <div>
            <Head>
                <title>appointment list</title>
            </Head>
            <Breadcrumb />
            <div className='px-2'>
                <AppointmentList />
            </div>
        </div>
    );
};

export default AdministratorAppointment;
AdministratorAppointment.getLayout = function getLayout(page) {
    return <AdministratorLayout>{page}</AdministratorLayout>;
};


