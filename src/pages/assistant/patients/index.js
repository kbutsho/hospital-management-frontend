import PatientList from '@/components/assistant/patient/patientList';
import Breadcrumb from '@/components/breadcrumb';
import AssistantLayout from '@/layouts/assistant/AssistantLayout';
import Head from 'next/head';
import React from 'react';

const AssistantPatient = () => {
    return (
        <div>
            <Head>
                <title>patients list</title>
            </Head>
            <Breadcrumb />
            <div className='px-2'>
                <PatientList />
            </div>
        </div>
    );
};

export default AssistantPatient;
AssistantPatient.getLayout = function getLayout(page) {
    return <AssistantLayout>{page}</AssistantLayout>;
};