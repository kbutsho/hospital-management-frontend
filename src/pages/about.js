import aboutImage from '../assets/home/about.jpg'
import Link from "next/link";
import Image from 'next/legacy/image'
import { useSelector } from 'react-redux';
import Aos from 'aos';
import { useEffect } from 'react';
import MainLayout from '@/layouts/MainLayout';

const About = () => {
    const info = useSelector(state => state.site_info.data);
    useEffect(() => {
        Aos.init({ duration: 1000 });
    }, []);
    return (
        <div className="container py-5" style={{ marginTop: "100px" }}>
            <div className="row">
                <div className="col-md-6 py-2" data-aos="fade-right">
                    <h3 className="fw-bold text-success text-uppercase">About {info?.organization_name}</h3>
                    <div style={{ minHeight: "300px" }}>
                        <p className="mt-4" style={{ width: "100%", textAlign: "justify", lineHeight: "1.5" }}>
                            {/* {info?.about} */}
                        </p>
                    </div>
                    {/* <div className="d-flex mt-4">
                        <Link style={{ borderRadius: "2px" }} className="btn btn-success me-3 fw-bold px-3" href="/about">Learn more</Link>
                        <Link style={{ borderRadius: "2px" }} className="btn btn-outline-success fw-bold px-3" href="/about">About our service</Link>
                    </div> */}
                </div>
                <div className="col-md-6 py-2" data-aos="fade-left">
                    <Image priority={true} style={{ borderRadius: "2px" }} src={aboutImage} layout="responsive" alt="img" />
                </div>
            </div>
        </div>
    );
};

export default About;
About.getLayout = function getLayout(page) {
    return <MainLayout>{page}</MainLayout>;
};
