import { errorHandler } from '@/helpers/errorHandler';
import MainLayout from '@/layouts/MainLayout';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { toast } from 'react-toastify'
import axios from 'axios'

const DoctorDetails = () => {
    const router = useRouter();
    const { id } = router.query;

    const [doctorDetails, setDoctorDetails] = useState(null)
    const fetchDoctorDetails = async () => {
        try {
            const response = await axios.get(`${config.api}/doctor`)
        } catch (error) {
            errorHandler({ error, toast })
        }
    }
    return (
        <div>

        </div>
    );
};

export default DoctorDetails;
DoctorDetails.getLayout = function getLayout(page) {
    return <MainLayout>{page}</MainLayout>;
};