import Breadcrumb from '@/components/breadcrumb';
import PrescriptionList from '@/components/doctor/prescriptions/PrescriptionList';
import DoctorLayout from '@/layouts/doctor/DoctorLayout';
import Head from 'next/head';

const DoctorPrescription = () => {
    return (
        <div>
            <Head>
                <title>prescription list</title>
            </Head>
            <Breadcrumb />
            <div className='px-2'>
                <PrescriptionList />
            </div>
        </div>
    );
};

export default DoctorPrescription;
DoctorPrescription.getLayout = function getLayout(page) {
    return <DoctorLayout>{page}</DoctorLayout>;
};


