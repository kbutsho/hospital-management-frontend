import Image from "next/image";
import aboutImage from '../../../assets/home/about.jpg'
import Link from "next/link";


const About = () => {
    return (
        <div className="container py-5">
            <div className="row">
                <div className="col-md-6 py-2">
                    <h3 className="fw-bold text-success text-uppercase">About ABC Hospital</h3>
                    <p className="mt-4" style={{ width: "100%", textAlign: "justify", lineHeight: "1.5" }}>
                        Welcome to our hospital management website, your comprehensive gateway to accessing vital information about our healthcare services. Our website is designed to provide patients and visitors with easy access to essential details, including department information and profiles of experienced doctors. Explore our various departments, each dedicated to specialized areas of medical care such as internal medicine, surgery, obstetrics and gynecology, pediatrics, emergency medicine, and radiology. Within each department, you'll find a team of skilled professionals committed to delivering compassionate and effective treatment. Our website also features profiles of our experienced doctors, showcasing their expertise and dedication to providing top-quality care to our patients. Whether you're seeking information about our services, looking to schedule an appointment, or simply want to learn more about our hospital, our website is here to guide you every step of the way.
                    </p>
                    <div className="d-flex mt-4">
                        <Link className="btn btn-success me-3 fw-bold px-3" href="/">Learn more</Link>
                        <Link className="btn btn-outline-success fw-bold px-3" href="/">About our service</Link>
                    </div>
                </div>
                <div className="col-md-6 py-2">
                    <Image src={aboutImage} height={100} width={100} layout="responsive" />
                </div>
            </div>
        </div>
    );
};

export default About;