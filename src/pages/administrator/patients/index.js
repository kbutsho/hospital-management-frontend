import PatientList from '@/components/administrator/patient/PatientList';
import Breadcrumb from '@/components/breadcrumb';
import AdministratorLayout from '@/layouts/administrator/AdministratorLayout';
import Head from 'next/head';

const AdministratorPatient = () => {
    return (
        <div>
            <Head>
                <title>patient list</title>
            </Head>
            <Breadcrumb />
            <div className='px-2'>
                <PatientList />
            </div>
        </div>
    );
};

export default AdministratorPatient;
AdministratorPatient.getLayout = function getLayout(page) {
    return <AdministratorLayout>{page}</AdministratorLayout>;
};


