import ScheduleList from '@/components/administrator/schedules/ScheduleList';
import Breadcrumb from '@/components/breadcrumb';
import AdministratorLayout from '@/layouts/administrator/AdministratorLayout';
import Head from 'next/head';

const AdministratorSchedule = () => {
    return (
        <div >
            <Head>
                <title>chambers list</title>
            </Head>
            <Breadcrumb />
            <div className='px-2'>
                <ScheduleList />
            </div>
        </div>
    );
};

export default AdministratorSchedule;
AdministratorSchedule.getLayout = function getLayout(page) {
    return <AdministratorLayout>{page}</AdministratorLayout>;
};