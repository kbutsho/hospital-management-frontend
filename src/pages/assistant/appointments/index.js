import AppointmentList from '@/components/assistant/appointments/AppointmentList';
import Breadcrumb from '@/components/breadcrumb';
import AssistantLayout from '@/layouts/assistant/AssistantLayout';
import Head from 'next/head';

const AssistantAppointment = () => {
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

export default AssistantAppointment;
AssistantAppointment.getLayout = function getLayout(page) {
    return <AssistantLayout>{page}</AssistantLayout>;
};


