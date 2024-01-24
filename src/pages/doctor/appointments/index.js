import Breadcrumb from '@/components/breadcrumb';
import AppointmentList from '@/components/doctor/appointments/AppointmentList';
import DoctorLayout from '@/layouts/doctor/DoctorLayout';
import Head from 'next/head';

const DoctorAppointment = () => {
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

export default DoctorAppointment;
DoctorAppointment.getLayout = function getLayout(page) {
    return <DoctorLayout>{page}</DoctorLayout>;
};


