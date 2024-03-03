import Doctor from '@/components/home/doctor/Doctor';
import MainLayout from '@/layouts/MainLayout';

const FIndDoctor = () => {
    return (
        <Doctor />
    );
};

export default FIndDoctor;
FIndDoctor.getLayout = function getLayout(page) {
    return <MainLayout>{page}</MainLayout>;
};