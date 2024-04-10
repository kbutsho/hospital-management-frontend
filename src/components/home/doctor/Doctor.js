import { doctorData } from './doctorData';
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

const Doctor = () => {
    const [doctor, setDoctor] = useState(null);
    const router = useRouter();
    const fetchDoctor = async () => {
        try {
            const response = await axios.get(`${config.api}/doctor/all`)
            setDoctor(response.data.data)
        } catch (error) {
            errorHandler({ error, toast })
        }
    }
    useEffect(() => {
        fetchDoctor()
    }, [])

    const doctorDetails = (id) => {
        router.push(`our-doctors/${id}`)
    }
    return (
        <div className="container py-4" style={{ minHeight: '100vh' }}>
            <div className='mb-4 d-flex justify-content-between'>
                <h2 className="fw-bold text-uppercase text-success">our Doctors</h2>
                <div>
                    <button className='btn btn-primary fw-bold btn-sm'>show all</button>
                </div>
            </div>
            <div className="row">
                {doctor?.slice(1, 9).map((doctor, index) => (
                    <div key={index} className="col-md-3">
                        <div className={`mb-4 ${styles.doctorCard}`}>
                            <div className="card-body" onClick={() => doctorDetails(doctor.id)}>
                                <div className='p-4'>
                                    {
                                        doctor.photo ?
                                            <Image style={{ borderRadius: "6px" }}
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
                                <div className='px-3 p-3'>
                                    <h5 style={{ minHeight: "50px" }}
                                        className="card-title fw-bold text-success mt-4 text-uppercase">{doctor.doctorName}</h5>
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
