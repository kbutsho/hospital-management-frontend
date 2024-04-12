import MainLayout from '@/layouts/MainLayout';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { config } from '@/config';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import styles from '@/styles/Home.module.css';
import { errorHandler } from '@/helpers/errorHandler';

const appointment = () => {
    const router = useRouter();
    const { id } = router.query;
    const [details, setDetails] = useState(null)
    const info = useSelector(state => state.site_info.data);
    const fetchDoctorDetails = async () => {
        try {
            if (id) {
                const response = await axios.get(`${config.api}/doctor/info/${id}`)
                setDetails(response.data.data)
            }
        } catch (error) {
            console.log(error)
            errorHandler({ error, toast })
        }
    }
    useEffect(() => {
        fetchDoctorDetails()
    }, [id])
    return (
        <div className='container py-5' style={{ minHeight: "80vh" }}>
            <div className={`p-5 ${styles.deptCard} mt-5`}>
                <h4 className='text-uppercase fw-bold mb-4'>take appointment</h4>
                <div>
                    <h6 className='fw-bold text-uppercase'>Address</h6>
                    <p>{info?.address}</p>

                    <h6 className='fw-bold text-uppercase'>phone</h6>
                    <p>{info?.phone}, {details?.phone}</p>

                    <h6 className='fw-bold text-uppercase'>Email</h6>
                    <p>{info?.email}, {details?.email}</p>
                    <Link
                        href="/serial"
                        style={{ borderRadius: "2px" }}
                        className='text-uppercase fw-bold btn btn-success mt-3 px-4'>
                        take self appointment
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default appointment;
appointment.getLayout = function getLayout(page) {
    return <MainLayout>{page}</MainLayout>;
};
