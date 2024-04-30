import Breadcrumb from "@/components/breadcrumb";
import DoctorLayout from "@/layouts/doctor/DoctorLayout";
import Head from "next/head";
import { useRouter } from "next/router";
import styles from "@/styles/administrator/List.module.css"
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import axios from "axios";
import { config } from "@/config";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { errorHandler } from "@/helpers/errorHandler";
import { SyncLoader } from "react-spinners";
import ReactToPrint from "react-to-print";
import { toast } from "react-toastify";
import { APPOINTMENT_STATUS } from "@/constant";
import Link from "next/link";
import Image from "next/image";
import icon from "../../../../assets/icon.png"
import { useSelector } from 'react-redux';


const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
const Prescribe = () => {
    const info = useSelector(state => state.site_info.data);
    const router = useRouter();
    const ref = useRef()
    const { id } = router.query;
    const token = Cookies.get('token');
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(false)
    const [patientData, setPatientData] = useState(null);
    const [dxHistoryContent, setDxHistoryContent] = useState('');
    const [medicationContent, setMedicationContent] = useState('');
    const [print, setPrint] = useState(false)


    const role = Cookies.get('role');
    const handelLogout = () => {
        Cookies.remove('name')
        Cookies.remove('token')
        Cookies.remove('role')
        router.push('/')
        toast.success("logout successfully!")
    }
    useEffect(() => {
        const fetchPatientWithAppointments = async () => {
            try {
                setLoading(true)
                if (id) {
                    const res = await axios.get(`${config.api}/doctor/prescription/patient-prescriptions/${id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                    setPatientData(res.data.data)
                    //  setContent(`<div><h3><strong>NAME ${res.data.data?.patient?.name}</strong></h3><h3><strong>AGE ${res.data.data?.patient?.age}</strong></h3></div>`);
                    // setDxHistoryContent(`<div><h6><strong>Dx,</strong></h6></div>`);
                    // setMedicationContent(`<div><h6><strong>Medication, </strong></h6></div>`);
                }
                setLoading(false)
            } catch (error) {
                setLoading(false)
                errorHandler({ error, setErrorMessage })
            }
        };
        fetchPatientWithAppointments();
    }, [id])

    const handleDXHistoryChange = (value) => {
        setDxHistoryContent(value);
    };

    const handleMedicationChange = (value) => {
        setMedicationContent(value);
    };


    const handleSave = async () => {
        try {
            setLoading(true)
            const data = {
                patient_id: patientData?.patient?.id,
                appointment_id: id,
                history: JSON.stringify({ dxHistoryContent }),
                medication: JSON.stringify({ medicationContent })
            };
            const res = await axios.post(`${config.api}/doctor/prescription/save`, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setPrint(true)
            setLoading(false)
            toast.success(res.data.message)

        } catch (error) {
            console.log(error);
            setLoading(false)
            errorHandler({ error, toast })
        }
    };

    const handelErrorMessage = () => {
        setErrorMessage(null)
    }

    const togglePrint = () => {
        setPrint(false)
    }

    const handelClose = async () => {
        try {
            setLoading(true)
            const data = {
                id: id,
                status: APPOINTMENT_STATUS.CLOSED
            }
            const response = await axios.post(`${config.api}/doctor/appointment/update/status`, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log(response)
            if (response.data.status) {
                router.push(`/doctor/appointments`);
            }
        } catch (error) {
            console.log(error)
            errorHandler({ error, setErrorMessage })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container py-5">
            <Head>
                <title>prescription</title>
            </Head>
            <nav className="navbar navbar-expand-lg alert alert-success py-1" style={{ borderRadius: "2px" }}>
                <Image src={icon} height={50} width={50} alt="icon" />
                <Link
                    className="ms-2 navbar-brand fw-bold text-success text-uppercase"
                    href="/">{info?.organization_name}</Link>

                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div className="navbar-nav ms-auto">
                        <Link className="nav-item nav-link fw-bold text-black" href="/doctor/profile">DASHBOARD</Link>
                        <Link className="nav-item nav-link fw-bold text-black" href="/doctor/appointments">APPOINTMENT</Link>
                        <Link className="nav-item nav-link fw-bold text-black" href="/doctor/patients">PATIENT</Link>
                        <button className="nav-item nav-link fw-bold text-danger" onClick={handelLogout}>LOGOUT</button>
                    </div>
                </div>
            </nav>
            <Breadcrumb />

            <div className={`py-3 ${styles.listArea}`}>
                {
                    loading ? null : (
                        errorMessage ? (
                            <div className="alert alert-danger fw-bold">
                                <div className='d-flex justify-content-between'>
                                    {errorMessage}
                                    <ImCross size="18px"
                                        className='pt-1'
                                        style={{ cursor: "pointer" }}
                                        onClick={handelErrorMessage} />
                                </div>
                            </div>
                        ) : null
                    )
                }
                {
                    loading ? <div className={styles.loadingArea}>
                        <SyncLoader color='#36D7B7' size="12" />
                    </div> :
                        <div style={{ minHeight: "240vh" }}>
                            {
                                print ? null :
                                    <div
                                        className="p-3"
                                        style={{ background: "#fff", boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px", marginBottom: "50px" }}>
                                        <div className="d-flex justify-content-between">
                                            <h6 className="fw-bold">NAME: {patientData?.patient?.name}</h6>
                                            <h6 className="fw-bold">AGE: {patientData?.patient?.age}</h6>
                                        </div>
                                        <div className="row mt-4">
                                            <div className="col-md-5">
                                                <h6
                                                    className='mb-3 text-uppercase alert alert-success'
                                                    style={{ borderRadius: "2px" }}>
                                                    <strong>DX and Patient Medical History</strong>
                                                </h6>
                                                <ReactQuill
                                                    theme="snow"
                                                    value={dxHistoryContent}
                                                    onChange={handleDXHistoryChange}
                                                    style={{ height: '420px' }}
                                                />
                                            </div>

                                            <div className="col-md-7">
                                                <h6
                                                    className='mb-3 text-uppercase alert alert-success'
                                                    style={{ borderRadius: "2px" }}>
                                                    <strong>Medication</strong>
                                                </h6>
                                                <ReactQuill
                                                    theme="snow"
                                                    value={medicationContent}
                                                    onChange={handleMedicationChange}
                                                    style={{ height: '420px' }}
                                                />
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-end mb-3" style={{ marginTop: "70px" }}>
                                            {
                                                print ? null :
                                                    <button
                                                        onClick={handleSave}
                                                        className="fw-bold btn btn-primary px-4"
                                                        style={{ borderRadius: "2px" }}>
                                                        save
                                                    </button>
                                            }
                                        </div>
                                    </div>
                            }
                            {
                                print ? <div className="d-flex justify-content-end mb-3">
                                    <button
                                        onClick={togglePrint}
                                        style={{ borderRadius: "2px" }}
                                        className='fw-bold btn btn-success px-4'>
                                        Edit
                                    </button>
                                    <ReactToPrint trigger={() =>
                                        <button
                                            className='fw-bold btn btn-primary mx-2 px-4'
                                            style={{ borderRadius: "2px" }}>
                                            print
                                        </button>}
                                        content={() => ref.current} />
                                    <button
                                        onClick={handelClose}
                                        style={{ borderRadius: "2px" }}
                                        className='fw-bold btn btn-danger px-4'>
                                        close
                                    </button>
                                </div> : null
                            }
                            <div style={{ background: "#E9E9E9" }}>
                                <div
                                    className="me-auto"
                                    ref={ref}
                                    style={{ width: "816px", height: "1056px", background: "#E9E9E9" }}>
                                    <div className="p-4" >
                                        <div className="d-flex justify-content-between">
                                            <div className="d-flex">
                                                <h6 className="fw-bold me-2">NAME: {patientData?.patient?.name},</h6>
                                                <h6 className="fw-bold">AGE: {patientData?.patient?.age}</h6>
                                            </div>
                                            <h6 className="fw-bold">DATE: {new Date().toLocaleDateString('en-GB')}</h6>
                                        </div>
                                        <div className="row mt-4">
                                            <div className="col-5">
                                                <div dangerouslySetInnerHTML={{ __html: dxHistoryContent }} />
                                            </div>
                                            <div className="col-7">
                                                <div dangerouslySetInnerHTML={{ __html: medicationContent }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                }
            </div>
        </div>
    );
};

export default Prescribe;
// Prescribe.getLayout = function getLayout(page) {
//     return <DoctorLayout>{page}</DoctorLayout>;
// };

