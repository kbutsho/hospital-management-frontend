import DoctorLayout from '@/layouts/doctor/DoctorLayout';
import { useRouter } from 'next/router';


const PatientDetails = () => {
    const router = useRouter()
    const { id } = router.query

    return (
        <div>
            {id}
        </div>
    );
};

export default PatientDetails;
PatientDetails.getLayout = function getLayout(page) {
    return <DoctorLayout>{page}</DoctorLayout>;
};