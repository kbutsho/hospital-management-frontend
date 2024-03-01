import MainLayout from '@/layouts/MainLayout';

const AboutUs = () => {
    return (
        <div className='d-flex justify-content-center align-items-center' style={{ height: "100vh" }}>
            <h3 className='fw-bold'>About us page</h3>
        </div>
    );
};
export default AboutUs;

AboutUs.getLayout = function getLayout(page) {
    return <MainLayout>{page}</MainLayout>;
};