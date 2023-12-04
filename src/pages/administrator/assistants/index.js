import AssistantList from '@/components/administrator/assistants/AssistantList';
import Breadcrumb from '@/components/breadcrumb';
import AdministratorLayout from '@/layouts/administrator/AdministratorLayout';
import Head from 'next/head';

const AdministratorAssistant = () => {
    return (
        <div >
            <Head>
                <title>assistant list</title>
            </Head>
            <Breadcrumb />
            <div className='px-2'>
                <AssistantList />
            </div>
        </div>
    );
};

export default AdministratorAssistant;
AdministratorAssistant.getLayout = function getLayout(page) {
    return <AdministratorLayout>{page}</AdministratorLayout>;
};