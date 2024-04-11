import { errorHandler } from '@/helpers/errorHandler';
import MainLayout from '@/layouts/MainLayout';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify'
import axios from 'axios'
import { config } from '@/config';
import demoUser from '../../assets/user.png'
import Image from 'next/legacy/image'
import { ImCross } from 'react-icons/im';
import { Modal, ModalBody } from 'reactstrap';
import { useSelector } from 'react-redux';
import Link from 'next/link'
import Aos from 'aos';


const DoctorDetails = () => {
    const router = useRouter();
    const { id } = router.query;
    const [details, setDetails] = useState(null)
    const [bioData, setBioData] = useState('')

    const fetchDoctorDetails = async () => {
        try {
            if (id) {
                const response = await axios.get(`${config.api}/doctor/info/${id}`)
                setDetails(response.data.data)
                const startIndex = response.data.data.bio.indexOf('{"bioData":"') + '{"bioData":"'.length;
                const endIndex = response.data.data.bio.lastIndexOf('"}');
                const extractedContent = response.data.data.bio.substring(startIndex, endIndex);
                setBioData(extractedContent)
            }
        } catch (error) {
            console.log(error)
            errorHandler({ error, toast })
        }
    }

    useEffect(() => {
        fetchDoctorDetails()
    }, [id])

    const [appointmentModal, setAppointmentModal] = useState(false)
    const toggleAppointmentModal = () => {
        setAppointmentModal(!appointmentModal)
    }
    const info = useSelector(state => state.site_info.data);
    useEffect(() => {
        Aos.init({ duration: 1000 });
    }, []);

    return (
        <div className='container py-5' style={{ minHeight: "100vh" }}>
            {details && (
                <div className='row'>
                    <div className="col-md-4" data-aos="fade-up">
                        <div className='py-4 px-5'>
                            {
                                details.photo ?
                                    <Image style={{ borderRadius: "2px" }}
                                        height={80} width={80}
                                        layout='responsive'
                                        src={`${config.backend_api}/uploads/doctorProfile/${details?.photo}`}
                                        alt="photo" /> :
                                    <Image style={{ borderRadius: "2px" }}
                                        height={80} width={80}
                                        layout='responsive'
                                        src={demoUser}
                                        alt="img" />
                            }
                        </div>
                        <div className='py-4 px-5' style={{ marginTop: "-25px" }}>
                            <h5 className='fw-bold'>{details.name}</h5>
                            <h6 className='fw-bold'>{details.designation}</h6>
                            <h6 className='fw-bold'>contact</h6>
                            <ul>
                                <li className='fw-bold'>{details.phone}</li>
                                <li className='fw-bold'>{details.email}</li>
                            </ul>
                            <button
                                style={{ borderRadius: "2px" }}
                                onClick={toggleAppointmentModal}
                                className='text-uppercase fw-bold btn btn-success w-100'>
                                Get Appointment
                            </button>
                        </div>
                    </div>
                    <div className="col-md-8" style={{ maxHeight: "100vh", overflowY: "scroll", scrollbarWidth: "none" }}>
                        <div className='py-4 px-5'>
                            <div dangerouslySetInnerHTML={{ __html: bioData }} />
                        </div>
                    </div>
                </div>
            )}
            {
                appointmentModal ? (
                    <div>
                        <Modal isOpen={appointmentModal} className="modal-lg">
                            <ModalBody>
                                <div className='p-3'>
                                    <div className='d-flex justify-content-between'>
                                        <h4 className='text-uppercase fw-bold mb-4'>get appointment</h4>
                                        <ImCross size="30px"
                                            className='pt-2'
                                            style={{ cursor: "pointer", color: "red" }}
                                            onClick={toggleAppointmentModal} />
                                    </div>
                                    <div>
                                        <h6 className='fw-bold text-uppercase'>Address</h6>
                                        <p>{info?.address}</p>

                                        <h6 className='fw-bold text-uppercase'>phone</h6>
                                        <p>{info?.phone}, {details.phone}</p>

                                        <h6 className='fw-bold text-uppercase'>Email</h6>
                                        <p>{info?.email}, {details.email}</p>

                                        <Link
                                            href="/serial"
                                            style={{ borderRadius: "2px" }}
                                            className='text-uppercase fw-bold btn btn-success w-100 mt-3'>
                                            take self appointment
                                        </Link>
                                    </div>
                                </div>
                            </ModalBody>
                        </Modal>
                    </div>
                ) : null
            }
        </div>
    );
};

export default DoctorDetails;

DoctorDetails.getLayout = function getLayout(page) {
    return <MainLayout>{page}</MainLayout>;
};
