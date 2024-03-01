import MainLayout from '@/layouts/MainLayout';

const Department = () => {
    return (
        <div className='d-flex justify-content-center align-items-center' style={{ height: "100vh" }}>
            <h3 className='fw-bold'>Department page</h3>
        </div>
    );
};

export default Department;
Department.getLayout = function getLayout(page) {
    return <MainLayout>{page}</MainLayout>;
};