import { errorHandler } from '@/helpers/errorHandler';
import MainLayout from '@/layouts/MainLayout';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify'
import axios from 'axios'
import { config } from '@/config';
import demoUser from '../../../assets/user.png'
import Image from 'next/legacy/image'
import Aos from 'aos';
import styles from '@/styles/Home.module.css';


const Details = () => {
    const router = useRouter();
    const { id } = router.query;
    const [details, setDetails] = useState(null)
    const [doctor, setDoctor] = useState(null)

    const fetchDepartmentDetails = async () => {
        try {
            if (id) {
                const response = await axios.get(`${config.api}/department/info/${id}`)
                setDetails(response.data.data.department)
                setDoctor(response.data.data.doctor)

            }
        } catch (error) {
            console.log(error)
            errorHandler({ error, toast })
        }
    }

    useEffect(() => {
        fetchDepartmentDetails()
    }, [id])

    const getAppointment = (id) => {
        router.push(`/doctors/${id}/appointment`)
    }
    useEffect(() => {
        Aos.init({ duration: 1000 });
    }, []);

    const doctorDetails = (id) => {
        router.push(`/doctors/${id}`)
    }
    return (
        <div className='container py-5' style={{ minHeight: "100vh" }}>
            {
                doctor && details ? (
                    <div>
                        <div>
                            <h2 className='fw-bold text-uppercase text-success mb-3'>{details?.name}</h2>
                            <p>{details?.description}</p>
                            <h4 className='fw-bold text-uppercase mt-5'>our {details?.name} SPECIALIST</h4>
                        </div>
                        <div className="row mt-4">
                            {doctor.map((doctor, index) => (
                                <div key={index} className="col-md-3" data-aos="fade-up">
                                    <div className={`mb-4 ${styles.doctorCard}`}>
                                        <div className="card-body" >
                                            <div className='p-4'>
                                                {doctor.photo ? (
                                                    <Image
                                                        onClick={() => doctorDetails(doctor.id)}
                                                        style={{ borderRadius: "6px" }}
                                                        height={80} width={80}
                                                        layout='responsive'
                                                        src={`${config.backend_api}/uploads/doctorProfile/${doctor.photo}`}
                                                        alt={doctor.name} />
                                                ) : (
                                                    <Image
                                                        style={{ borderRadius: "6px" }}
                                                        height={80} width={80}
                                                        layout='responsive'
                                                        src={demoUser}
                                                        alt={doctor.name} />
                                                )}
                                            </div>
                                            <div className='p-4'>
                                                <h5
                                                    onClick={() => doctorDetails(doctor.id)}
                                                    style={{ minHeight: "50px" }}
                                                    className="card-title fw-bold text-success text-uppercase">
                                                    {doctor.name}
                                                </h5>
                                                <button
                                                    onClick={() => getAppointment(doctor.id)}
                                                    style={{ borderRadius: "2px" }}
                                                    className='text-uppercase fw-bold btn btn-success w-100 mt-3'>
                                                    Get Appointment
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : null
            }
        </div>
    );
};

export default Details;

Details.getLayout = function getLayout(page) {
    return <MainLayout>{page}</MainLayout>;
};
