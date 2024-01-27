import Breadcrumb from "@/components/breadcrumb";
import DoctorLayout from "@/layouts/doctor/DoctorLayout";
import Head from "next/head";
import { useRouter } from "next/router";

const AppointmentDetails = () => {
    const router = useRouter();
    const { id } = router.query;
    return (
        <div>
            <Head>
                <title>appointment details</title>
            </Head>
            <Breadcrumb />
            <div className='px-2'>


                <h6>{id}</h6>
                <button>prescribe</button>


            </div>
        </div>
    );
};

export default AppointmentDetails;
AppointmentDetails.getLayout = function getLayout(page) {
    return <DoctorLayout>{page}</DoctorLayout>;
};