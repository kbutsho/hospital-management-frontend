import SerialList from '@/components/administrator/serial/SerialList';
import Breadcrumb from '@/components/breadcrumb';
import AdministratorLayout from '@/layouts/administrator/AdministratorLayout';
import Head from 'next/head';

const AdministratorSerial = () => {
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

export default AdministratorSerial;
AdministratorSerial.getLayout = function getLayout(page) {
    return <AdministratorLayout>{page}</AdministratorLayout>;
};


