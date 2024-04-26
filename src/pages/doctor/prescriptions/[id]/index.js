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

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
const Prescribe = () => {
    const router = useRouter();
    const ref = useRef()
    const { id } = router.query;
    const token = Cookies.get('token');
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(false)
    const [patientData, setPatientData] = useState(null);
    const [dxHistoryContent, setDxHistoryContent] = useState('');
    const [medicationContent, setMedicationContent] = useState('');

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
            const data = {
                content: JSON.stringify({ content })
            };
        } catch (error) {
            console.log(error);
        }
    };




    const handelErrorMessage = () => {
        setErrorMessage(null)
    }




    return (
        <div>
            <Head>
                <title>prescription</title>
            </Head>
            <Breadcrumb />
            <div className={`px-2 py-3 ${styles.listArea}`}>
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
                        <div style={{ minHeight: "260vh" }}>
                            {/* <pre>{JSON.stringify(patientData, null, 2)}</pre> */}
                            <div className="p-3 mb-4" style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px", }}>
                                <div className="d-flex justify-content-between">
                                    <h6 className="fw-bold">NAME: {patientData?.patient?.name}</h6>
                                    <h6 className="fw-bold">AGE: {patientData?.patient?.age}</h6>
                                </div>
                                <div className="row mt-4">
                                    <div className="col-md-5">
                                        <h6 className='mb-3 text-uppercase alert alert-success' style={{ borderRadius: "2px" }}><strong>DX and Patient Medical History</strong></h6>
                                        <ReactQuill
                                            theme="snow"
                                            value={dxHistoryContent}
                                            onChange={handleDXHistoryChange}
                                            style={{ height: '420px' }}
                                        />
                                    </div>

                                    <div className="col-md-7">
                                        <h6 className='mb-3 text-uppercase alert alert-success' style={{ borderRadius: "2px" }}><strong>Medication</strong></h6>
                                        <ReactQuill
                                            theme="snow"
                                            value={medicationContent}
                                            onChange={handleMedicationChange}
                                            style={{ height: '420px' }}
                                        />
                                    </div>
                                </div>
                                <div className="d-flex justify-content-end mb-3" style={{ marginTop: "70px" }}>
                                    <ReactToPrint trigger={() =>
                                        <button className='fw-bold btn btn-primary me-2' style={{ borderRadius: "2px" }}>save and print</button>}
                                        content={() => ref.current} />
                                    <button className="fw-bold btn btn-primary" style={{ borderRadius: "2px" }}>save</button>
                                </div>
                            </div>

                            <div style={{ background: "#D1E7DD" }}>
                                <div className="me-auto" ref={ref} style={{ width: "816px", height: "1056px", background: "#D1E7DD" }}>
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
Prescribe.getLayout = function getLayout(page) {
    return <DoctorLayout>{page}</DoctorLayout>;
};

//  <div dangerouslySetInnerHTML={{ __html: content }} />

// {typeof window !== 'undefined' && (
//     <ReactQuill
//         theme="snow"
//         value={content}
//         onChange={handleChange}
//         style={{ height: '350px' }}
//     />
// )}

// <button className='btn btn-primary fw-bold px-3 mt-2' onClick={handleSave}>Save</button>
