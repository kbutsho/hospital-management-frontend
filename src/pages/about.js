import MainLayout from '@/layouts/MainLayout';
import About from '@/components/home/about/About';

const AboutUs = () => {
    return (
        <div>
            <About />
        </div>
    );
};
export default AboutUs;

AboutUs.getLayout = function getLayout(page) {
    return <MainLayout>{page}</MainLayout>;
};