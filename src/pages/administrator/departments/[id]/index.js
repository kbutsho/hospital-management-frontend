import AdministratorLayout from '@/layouts/administrator/AdministratorLayout';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { config } from '@/config';
import { errorHandler } from '@/helpers/errorHandler';
import Aos from 'aos';
import styles from '@/styles/Home.module.css';
import Image from 'next/image';
import Head from 'next/head';
import Breadcrumb from '@/components/breadcrumb';
import demoUser from '../../../../assets/user.png'
import { toast } from 'react-toastify';
import { SyncLoader } from 'react-spinners';

const DepartmentDetails = () => {
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
        router.push(`/administrator/doctors/${id}`)
    }
    return (
        <div className='px-2 py-3'>
            <Head>
                <title>department details</title>
            </Head>
            {
                doctor && details ? (
                    <div>
                        <Breadcrumb name={details?.name} />
                        <div className='container pt-3' style={{ minHeight: "100vh" }}>
                            <div>
                                <div data-aos="fade-up">
                                    <h2 className='fw-bold text-uppercase text-success mb-3'>{details?.name} Department</h2>
                                    <p style={{ textAlign: "justify" }}>{details?.description}</p>
                                    <h4 className='fw-bold text-uppercase mt-4'>{details?.name} SPECIALIST</h4>
                                </div>
                                <div className="row mt-4">
                                    {doctor.map((doctor, index) => (
                                        <div key={index} className="col-md-4" data-aos="fade-down">
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
                                                            // style={{ minHeight: "20px" }}
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

                        </div>
                    </div>
                ) : <div className={styles.loadingArea}>
                    <SyncLoader color='#d3d3d3' size="12" />
                </div>
            }
        </div>
    );
};

export default DepartmentDetails;
DepartmentDetails.getLayout = function getLayout(page) {
    return <AdministratorLayout>{page}</AdministratorLayout>;
};