import MainLayout from '@/layouts/MainLayout';

const Doctor = () => {
    return (
        <div className='d-flex justify-content-center align-items-center' style={{ height: "100vh" }}>
            <h3 className='fw-bold'>Find a doctor</h3>
        </div>
    );
};

export default Doctor;
Doctor.getLayout = function getLayout(page) {
    return <MainLayout>{page}</MainLayout>;
};