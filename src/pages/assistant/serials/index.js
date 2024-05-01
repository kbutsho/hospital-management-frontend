import SerialList from '@/components/assistant/serial/SerialList';
import Breadcrumb from '@/components/breadcrumb';
import AssistantLayout from '@/layouts/assistant/AssistantLayout';
import Head from 'next/head';

const AssistantSerial = () => {
    return (
        <div>
            <Head>
                <title>serial list</title>
            </Head>
            <Breadcrumb />
            <div className='px-2'>
                <SerialList />
            </div>
        </div>
    );
};

export default AssistantSerial;
AssistantSerial.getLayout = function getLayout(page) {
    return <AssistantLayout>{page}</AssistantLayout>;
};


