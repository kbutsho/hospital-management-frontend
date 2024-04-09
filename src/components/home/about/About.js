// import Image from "next/image";
import aboutImage from '../../../assets/home/about.jpg'
import Link from "next/link";
import Image from 'next/legacy/image'
import { useSelector } from 'react-redux';

const About = () => {
    const info = useSelector(state => state.site_info.data);
    return (
        <div className="container py-4">
            <div className="row">
                <div className="col-md-6 py-2">
                    <h3 className="fw-bold text-success text-uppercase">About {info?.organization_name}</h3>
                    <div style={{ minHeight: "300px" }}>
                        <p className="mt-4" style={{ width: "100%", textAlign: "justify", lineHeight: "1.5" }}>
                            {info?.about}
                        </p>
                    </div>
                    <div className="d-flex mt-4">
                        <Link className="btn btn-success me-3 fw-bold px-3" href="/">Learn more</Link>
                        <Link className="btn btn-outline-success fw-bold px-3" href="/">About our service</Link>
                    </div>
                </div>
                <div className="col-md-6 py-2">
                    <Image priority={true} style={{ borderRadius: "6px" }} src={aboutImage} layout="responsive" alt="img" />
                </div>
            </div>
        </div>
    );
};

export default About;