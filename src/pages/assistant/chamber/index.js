import Breadcrumb from '@/components/breadcrumb';
import AssistantLayout from '@/layouts/assistant/AssistantLayout';
import Head from 'next/head';

const AssistantChambers = () => {
    return (
        <div >
            <Head>
                <title>my chambers</title>
            </Head>
            <Breadcrumb />
            <div className='px-2'>
                <ChamberList />
            </div>
        </div>
    );
};

export default AssistantChambers;
AssistantChambers.getLayout = function getLayout(page) {
    return <AssistantLayout>{page}</AssistantLayout>;
};