import Breadcrumb from '@/components/breadcrumb';
import AdministratorLayout from '@/layouts/administrator/AdministratorLayout';
import axios from 'axios';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { config } from '@/config';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import Image from 'next/legacy/image';
import doctorLogo from '../../../assets/doctor.png'
import assistantLogo from '../../../assets/assistant.png'
import activeLogo from '../../../assets/checked.png'
import disabledLogo from '../../../assets/block.png'
import pendingLogo from '../../../assets/pending.png'
import departmentLogo from '../../../assets/department.png'
import chamberLogo from '../../../assets/chamber.png'
import appointmentLogo from '../../../assets/appointment.png'
import patientLogo from '../../../assets/patient.png'
import Link from 'next/link';


const AdministratorDashboard = () => {
    const token = Cookies.get('token');
    const [info, setInfo] = useState(null);
    useEffect(() => {
        const fetchDashboardInfo = async () => {
            try {
                const response = await axios.get(`${config.api}/administrator/dashboard/info`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                setInfo(response.data.data)
                console.log(response)
            } catch (error) {
                console.log(error)
                return errorHandler({ error, toast })
            }
        }
        fetchDashboardInfo()
    }, [])

    return (
        <div>
            <Head>
                <title>dashboard</title>
            </Head>
            <Breadcrumb />
            {/* <pre>{JSON.stringify(info, null, 2)}</pre> */}
            <div className='px-2 py-3'>
                {
                    info ?
                        <div className='row'>
                            <div className="col-md-4 my-2">
                                <Link href="/administrator/departments" className="card p-3" style={{ minHeight: "80px", textDecoration: "none" }}>
                                    <div className="row">
                                        <div className="col-6">
                                            <Image src={departmentLogo} height={60} width={60} alt="img" />
                                            <h5 className='fw-bold mt-2'>DEPARTMENT</h5>
                                        </div>
                                        <div className="col-6">
                                            <div className='d-flex flex-column gap-3'>
                                                <div className='d-flex align-items-center'>
                                                    <Image src={activeLogo} height={20} width={20} alt="img" />
                                                    <small className='text-uppercase fw-bold ms-2 text-success'>active {info?.department.active}</small>
                                                </div>
                                                <div className='d-flex align-items-center'>
                                                    <Image src={pendingLogo} height={20} width={20} alt="img" />
                                                    <small className='text-uppercase fw-bold ms-2 text-primary'>pending {info?.department.pending}</small>
                                                </div>
                                                <div className='d-flex align-items-center'>
                                                    <Image src={disabledLogo} height={20} width={20} alt="img" />
                                                    <small className='text-uppercase fw-bold ms-2 text-danger'>disabled {info?.department.disabled}</small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>

                            <div className="col-md-4 my-2">
                                <Link href="/administrator/doctors" className="card p-3" style={{ minHeight: "80px", textDecoration: "none" }}>
                                    <div className="row">
                                        <div className="col-6">
                                            <Image src={doctorLogo} height={60} width={60} alt="img" />
                                            <h5 className='fw-bold mt-2'>DOCTORS</h5>
                                        </div>
                                        <div className="col-6">
                                            <div className='d-flex flex-column gap-3'>
                                                <div className='d-flex align-items-center'>
                                                    <Image src={activeLogo} height={20} width={20} alt="img" />
                                                    <small className='text-uppercase fw-bold ms-2 text-success'>active {info?.doctor.active}</small>
                                                </div>
                                                <div className='d-flex align-items-center'>
                                                    <Image src={pendingLogo} height={20} width={20} alt="img" />
                                                    <small className='text-uppercase fw-bold ms-2 text-primary'>pending {info?.doctor.pending}</small>
                                                </div>
                                                <div className='d-flex align-items-center'>
                                                    <Image src={disabledLogo} height={20} width={20} alt="img" />
                                                    <small className='text-uppercase fw-bold ms-2 text-danger'>disabled {info?.doctor.disabled}</small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>

                            <div className="col-md-4 my-2">
                                <Link href="/administrator/assistants" className="card p-3" style={{ minHeight: "80px", textDecoration: "none" }}>
                                    <div className="row">
                                        <div className="col-6">
                                            <Image src={assistantLogo} height={60} width={60} alt="img" />
                                            <h5 className='fw-bold mt-2'>ASSISTANTS</h5>
                                        </div>
                                        <div className="col-6">
                                            <div className='d-flex flex-column gap-3'>
                                                <div className='d-flex align-items-center'>
                                                    <Image src={activeLogo} height={20} width={20} alt="img" />
                                                    <small className='text-uppercase fw-bold ms-2 text-success'>active {info?.assistant.active}</small>
                                                </div>
                                                <div className='d-flex align-items-center'>
                                                    <Image src={pendingLogo} height={20} width={20} alt="img" />
                                                    <small className='text-uppercase fw-bold ms-2 text-primary'>pending {info?.assistant.pending}</small>
                                                </div>
                                                <div className='d-flex align-items-center'>
                                                    <Image src={disabledLogo} height={20} width={20} alt="img" />
                                                    <small className='text-uppercase fw-bold ms-2 text-danger'>disabled {info?.assistant.disabled}</small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>

                            <div className="col-md-4 my-2">
                                <Link href="/administrator/chambers" className="card p-3" style={{ minHeight: "80px", textDecoration: "none" }}>
                                    <div className="row">
                                        <div className="col-6">
                                            <Image src={chamberLogo} height={60} width={60} alt="img" />
                                            <h5 className='fw-bold mt-2'>CHAMBERS</h5>
                                        </div>
                                        <div className="col-6">
                                            <div className='d-flex flex-column gap-3'>
                                                <div className='d-flex align-items-center'>
                                                    <Image src={activeLogo} height={20} width={20} alt="img" />
                                                    <small className='text-uppercase fw-bold ms-2 text-success'>active {info?.chamber.active}</small>
                                                </div>
                                                <div className='d-flex align-items-center'>
                                                    <Image src={pendingLogo} height={20} width={20} alt="img" />
                                                    <small className='text-uppercase fw-bold ms-2 text-primary'>pending {info?.chamber.pending}</small>
                                                </div>
                                                <div className='d-flex align-items-center'>
                                                    <Image src={disabledLogo} height={20} width={20} alt="img" />
                                                    <small className='text-uppercase fw-bold ms-2 text-danger'>disabled {info?.chamber.disabled}</small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>

                            <div className="col-md-4 my-2">
                                <Link href="/administrator/appointments" className="card p-3" style={{ minHeight: "80px", textDecoration: "none" }}>
                                    <div className="row">
                                        <div className="col-6">
                                            <Image src={appointmentLogo} height={60} width={60} alt="img" />
                                            <h5 className='fw-bold mt-2'>APOINTMENT</h5>
                                        </div>
                                        <div className="col-6">
                                            <div className='d-flex flex-column gap-3'>
                                                <div className='d-flex align-items-center'>
                                                    <Image src={activeLogo} height={20} width={20} alt="img" />
                                                    <small className='text-uppercase fw-bold ms-2 text-success'>paid {info?.appointment.paid}</small>
                                                </div>
                                                <div className='d-flex align-items-center'>
                                                    <Image src={pendingLogo} height={20} width={20} alt="img" />
                                                    <small className='text-uppercase fw-bold ms-2 text-primary'>in progress {info?.appointment.in_progress}</small>
                                                </div>
                                                <div className='d-flex align-items-center'>
                                                    <Image src={disabledLogo} height={20} width={20} alt="img" />
                                                    <small className='text-uppercase fw-bold ms-2 text-danger'>closed {info?.appointment.closed}</small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>

                            <div className="col-md-4 my-2">
                                <Link href="/administrator/patients" className="card p-3" style={{ minHeight: "80px", textDecoration: "none" }}>
                                    <div className="row">
                                        <div className="col-6">
                                            <Image src={patientLogo} height={60} width={60} alt="img" />
                                            <h5 className='fw-bold mt-2'>PATIENTS</h5>
                                        </div>
                                        <div className="col-6">
                                            <div className='d-flex flex-column gap-3'>
                                                <div className='d-flex align-items-center'>
                                                    <Image src={activeLogo} height={20} width={20} alt="img" />
                                                    <small className='text-uppercase fw-bold ms-2 text-success'>registered {info?.patient}</small>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>

                        </div> : null
                }
            </div>
        </div >
    );
};

export default AdministratorDashboard;
AdministratorDashboard.getLayout = function getLayout(page) {
    return <AdministratorLayout>{page}</AdministratorLayout>;
};