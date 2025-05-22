import { MdEmail } from "react-icons/md";
import { IoCall } from "react-icons/io5";
import { useSelector } from 'react-redux';
import Aos from "aos";
import { useEffect } from "react";
import styles from '@/styles/Home.module.css';

const Contact = () => {
    const info = useSelector(state => state.site_info.data);
    useEffect(() => {
        Aos.init({ duration: 1000 });
    }, []);
    return (
        <div className='container py-4 mb-5'>
            <div className={`p-5 ${styles.deptCard}`} style={{ borderRadius: "6px" }}>
                <h2 className="text-center mb-5 fw-bold text-uppercase text-success">Contact us</h2>
                <div className="row">
                    <div className="col-md-6" data-aos="fade-right">
                        <div className="my-5">
                            <h2 className='fw-bold text-dark'>Lets chat.</h2>
                            <h4 className='fw-bold text-dark'>Tell us about your health condition.</h4>
                            <h6>We look forward to hearing from you.</h6>
                            <div className="d-flex mt-3">
                                <div className="me-2" style={{ marginTop: "12px" }}>
                                    <MdEmail size="30" />
                                </div>
                                <div>
                                    <div className="fw-bold">mail us at</div>
                                    <div className="fw-bold">kbutsho@gmail.com</div>
                                </div>
                            </div>
                            <div className="d-flex mt-3">
                                <div className="me-2" style={{ marginTop: "12px" }}>
                                    <IoCall size="28" />
                                </div>
                                <div>
                                    <div className="fw-bold">or call us</div>
                                    <div className="fw-bold">+8801621599321</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6" data-aos="fade-left">
                        <h2 className="fw-bold">Send us a message!</h2>
                        <form>
                            <input required type="text" className="form-control my-3" placeholder="your full name*" />
                            <input required type="text" className="form-control my-3" placeholder="your email address*" />
                            <input required type="text" className="form-control my-3" placeholder="your email subject*" />
                            <textarea required rows="4" placeholder='your message*' className='form-control my-3'></textarea>
                            <div className='d-flex justify-content-end'>
                                <input type="submit" className='btn btn-primary fw-bold' value="send message" />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;