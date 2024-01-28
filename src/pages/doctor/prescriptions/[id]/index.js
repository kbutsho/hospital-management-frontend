import Breadcrumb from "@/components/breadcrumb";
import DoctorLayout from "@/layouts/doctor/DoctorLayout";
import Head from "next/head";
import { useRouter } from "next/router";
import styles from "@/styles/administrator/List.module.css"
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import axios from "axios";
import { config } from "@/config";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { errorHandler } from "@/helpers/errorHandler";

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
const Prescribe = () => {
    const router = useRouter();
    const { id } = router.query;
    const token = Cookies.get('token');
    const [errorMessage, setErrorMessage] = useState(null);
    const [patientData, setPatientData] = useState(null);
    const [content, setContent] = useState('');

    useEffect(() => {
        const fetchPatientWithAppointments = async () => {
            try {
                if (id) {
                    const res = await axios.get(`${config.api}/doctor/prescription/patient-prescriptions/${id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                    setPatientData(res.data.data)
                    setContent(`<h3><strong>NAME ${res.data.data?.patient?.name}</strong></h3><h3><strong>AGE ${res.data.data?.patient?.age}</strong></h3>`);
                }
            } catch (error) {
                errorHandler({ error, setErrorMessage })
            }
        };
        fetchPatientWithAppointments();
    }, [id])

    const handleChange = (value) => {
        setContent(value);
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

    return (
        <div>
            <Head>
                <title>prescription</title>
            </Head>
            <Breadcrumb />
            <div className='px-2'>
                <div className={`py-3 ${styles.listArea}`}>
                    <div className='mb-5'>
                        {typeof window !== 'undefined' && (
                            <ReactQuill
                                theme="snow"
                                value={content}
                                onChange={handleChange}
                                style={{ height: '350px' }}
                            />
                        )}
                    </div>
                    <div className='d-flex justify-content-end'>
                        <button className='btn btn-primary fw-bold px-3 mt-2' onClick={handleSave}>save</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Prescribe;
Prescribe.getLayout = function getLayout(page) {
    return <DoctorLayout>{page}</DoctorLayout>;
};


