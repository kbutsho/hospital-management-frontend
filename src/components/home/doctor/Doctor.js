// import Image from 'next/image';
import Image from 'next/legacy/image'
import styles from '@/styles/Home.module.css';
import { useEffect, useState } from 'react';
import { errorHandler } from '@/helpers/errorHandler';
import { toast } from 'react-toastify';
import axios from 'axios';
import { config } from '@/config';
import demoUser from '../../../assets/user.png'
import { useRouter } from 'next/router';
import Link from "next/link"
import Aos from 'aos';


const Doctor = () => {
    const [doctor, setDoctor] = useState(null);
    const router = useRouter();
    const fetchDoctor = async () => {
        try {
            const response = await axios.get(`${config.api}/doctor/all`)
            setDoctor(response.data.data)
            console.log(response)
        } catch (error) {
            console.log(error)
            errorHandler({ error, toast })
        }
    }
    useEffect(() => {
        fetchDoctor()
    }, [])
    const doctorDetails = (id) => {
        router.push(`our-doctors/${id}`)
    }
    useEffect(() => {
        Aos.init({ duration: 1000 });
    }, []);
    return (
        <div className="container py-4" style={{ minHeight: '100vh' }}>
            <div className='mb-4 d-flex justify-content-between'>
                <h2 className="fw-bold text-uppercase text-success">our Doctors</h2>
                <div>
                    <Link
                        href="/our-doctors"
                        style={{ borderRadius: "2px" }}
                        className='btn btn-primary fw-bold btn-sm px-3'>
                        Show All
                    </Link>
                </div>
            </div>
            <div className="row">
                {/* <pre>{JSON.stringify(department, null, 2)}</pre> */}
                {doctor?.slice(1, 9).map((doctor, index) => (
                    <div key={index} className="col-md-3" >
                        <div className={`mb-4 ${styles.doctorCard}`} data-aos="fade-up">
                            <div className="card-body" >
                                <div className='p-4'>
                                    {
                                        doctor.photo ?
                                            <Image
                                                onClick={() => doctorDetails(doctor.id)}
                                                style={{ borderRadius: "6px" }}
                                                height={80} width={80}
                                                layout='responsive'
                                                src={`${config.backend_api}/uploads/doctorProfile/${doctor.photo}`}
                                                alt={doctor.doctorName} /> :
                                            <Image style={{ borderRadius: "6px" }}
                                                height={80} width={80}
                                                layout='responsive'
                                                src={demoUser}
                                                alt={doctor.doctorName} />
                                    }
                                </div>
                                <div className='p-4'>
                                    <h5
                                        onClick={() => doctorDetails(doctor.id)}
                                        style={{ minHeight: "50px" }}
                                        className="card-title fw-bold text-success text-uppercase">
                                        {doctor.doctorName}
                                    </h5>
                                    <button
                                        onClick={() => doctorDetails(doctor.id)}
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
    );
};

export default Doctor;
