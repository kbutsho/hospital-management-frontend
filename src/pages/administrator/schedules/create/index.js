import CreateSchedule from '@/components/administrator/schedules/CreateSchedule';
import Breadcrumb from '@/components/breadcrumb';
import AdministratorLayout from '@/layouts/administrator/AdministratorLayout';
import Head from 'next/head';
import { config } from '@/config';

const AdministratorScheduleCreate = ({ data, errorMessage }) => {
    return (
        <div>
            <Head>
                <title>create schedule</title>
            </Head>
            <Breadcrumb />
            <div className='px-2'>
                <CreateSchedule
                    error={errorMessage}
                    data={data?.data}
                />
            </div>
        </div>
    );
};

export default AdministratorScheduleCreate;

AdministratorScheduleCreate.getLayout = function getLayout(page) {
    return <AdministratorLayout>{page}</AdministratorLayout>;
};

export async function getStaticProps() {
    try {
        const response = await fetch(`${config.api}/schedule/doctor-chamber`);
        if (!response.ok) {
            return { props: { doctorList: [], errorMessage: 'Internal server error!' } };
        }
        const data = await response.json();
        return {
            props: {
                data,
                errorMessage: null,
            },
            revalidate: 30,
        };
    } catch (error) {
        console.log(error)
        return { props: { doctorList: [], errorMessage: 'Internal server error!' } };
    }
}
