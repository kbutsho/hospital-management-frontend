// import Image from 'next/image';
import Image from 'next/legacy/image'
import styles from '@/styles/Home.module.css';
import { useEffect, useState } from 'react';
import { errorHandler } from '@/helpers/errorHandler';
import { toast } from 'react-toastify';
import axios from 'axios';
import { config } from '@/config';
import demoUser from '../../assets/user.png'
import { useRouter } from 'next/router';
import MainLayout from '@/layouts/MainLayout';
import Aos from 'aos';


const OurDoctor = () => {
    const [doctor, setDoctor] = useState(null);
    const [department, setDepartment] = useState(null)
    const [filterByDept, setFilterByDept] = useState('')
    const router = useRouter();
    const fetchDepartment = async () => {
        try {
            const res = await axios.get(`${config.api}/department/all`)
            setDepartment(res.data.data)
        } catch (error) {
            errorHandler({ error, toast })
        }
    }
    const fetchDoctor = async () => {
        try {
            const data = {
                department: filterByDept
            }
            const response = await axios.get(`${config.api}/doctor/all`, {
                params: data
            });
            setDoctor(response.data.data)
            console.log(response.data)
        } catch (error) {
            console.log(error)
            errorHandler({ error, toast })
        }
    }
    useEffect(() => {
        fetchDoctor()
    }, [filterByDept])

    useEffect(() => {
        fetchDepartment()
    }, [])
    const handelFilterByDept = (deptName) => {
        setFilterByDept(deptName)
    }
    const doctorDetails = (id) => {
        router.push(`doctors/${id}`)
    }
    useEffect(() => {
        Aos.init({ duration: 1000 });
    }, []);
    return (
        <div className="container py-5" style={{ minHeight: '100vh' }}>
            <div className='mb-4 d-flex justify-content-between'>
                <h2 className="fw-bold text-uppercase text-success">our Doctors</h2>
            </div>
            {
                doctor && department ? (
                    <div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', maxWidth: '100%' }} data-aos="fade-up">
                            {/* Department List */}
                            <ul style={{ display: 'flex', flexWrap: 'wrap', padding: 0, listStyleType: 'none', margin: 0 }}>
                                <li
                                    key="all"
                                    onClick={() => handelFilterByDept('')}
                                    className={`btn btn-outline-success px-4 me-3 mb-3 fw-bold ${filterByDept === '' ? 'active' : ''}`}
                                    style={{ borderRadius: "2px", maxWidth: 'calc(50% - 16px)' }}>
                                    All Departments
                                </li>
                                {/* Render Individual Departments */}
                                {department.map(dept => (
                                    <li
                                        key={dept.id}
                                        onClick={() => handelFilterByDept(dept.name)}
                                        className={`btn btn-outline-success px-4 me-3 mb-3 fw-bold ${dept.name === filterByDept ? 'active' : ''}`}
                                        style={{ borderRadius: "2px", maxWidth: 'calc(50% - 16px)' }}>
                                        {dept.name}
                                    </li>
                                ))}
                            </ul>
                            <div className='mt-4'>
                                {filterByDept === '' ?
                                    <h4 className='fw-bold text-uppercase'>All doctor</h4> :
                                    <h4 className='fw-bold text-uppercase'>{filterByDept} SPECIALIST</h4>
                                }
                            </div>
                        </div>

                        {/* Doctor Cards */}
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
                                                        alt={doctor.doctorName} />
                                                ) : (
                                                    <Image
                                                        style={{ borderRadius: "6px" }}
                                                        height={80} width={80}
                                                        layout='responsive'
                                                        src={demoUser}
                                                        alt={doctor.doctorName} />
                                                )}
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
                ) : null
            }
        </div>
    );
};

export default OurDoctor;
OurDoctor.getLayout = function getLayout(page) {
    return <MainLayout>{page}</MainLayout>;
};
