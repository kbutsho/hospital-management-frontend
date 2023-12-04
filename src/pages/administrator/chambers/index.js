import ChamberList from '@/components/administrator/chambers/ChamberList';
import Breadcrumb from '@/components/breadcrumb';
import AdministratorLayout from '@/layouts/administrator/AdministratorLayout';
import Head from 'next/head';

const AdministratorChamber = () => {
    return (
        <div >
            <Head>
                <title>assistant list</title>
            </Head>
            <Breadcrumb />
            <div className='px-2'>
                <ChamberList />
            </div>
        </div>
    );
};

export default AdministratorChamber;
AdministratorChamber.getLayout = function getLayout(page) {
    return <AdministratorLayout>{page}</AdministratorLayout>;
};