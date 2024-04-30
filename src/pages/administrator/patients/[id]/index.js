import { useRouter } from 'next/router';
import styles from "@/styles/administrator/List.module.css"
import Breadcrumb from '@/components/breadcrumb';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { SyncLoader } from 'react-spinners';
import { errorHandler } from '@/helpers/errorHandler';
import axios from 'axios';
import Cookies from 'js-cookie';
import { config } from '@/config';
import { ImCross } from 'react-icons/im';
import AdministratorLayout from '@/layouts/administrator/AdministratorLayout';


const PatientDetails = () => {
    const router = useRouter()
    const { id } = router.query
    const token = Cookies.get('token');
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const [data, setData] = useState(null)
    const handelErrorMessage = () => {
        setErrorMessage(null)
    }
    const fetchData = async () => {
        try {
            if (id) {
                setLoading(true)
                const res = await axios.get(`${config.api}/administrator/patient/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                setLoading(false)
                setData(res.data.data)
                console.log(res.data.data)
            }
        } catch (error) {
            setLoading(false)
            console.log(error)
            errorHandler({ error, setErrorMessage })
        }
    }
    useEffect(() => {
        fetchData()
    }, [id])

    const extractHistoryHTML = (htmlString) => {
        const regex = /{"dxHistoryContent":"(.+?)"}$/;
        const match = htmlString.match(regex);
        if (match) {
            return match[1];
        } else {
            return '';
        }
    };
    const extractMedicationHTML = (htmlString) => {
        const regex = /{"medicationContent":"(.+?)"}$/;
        const match = htmlString.match(regex);
        if (match) {
            return match[1];
        } else {
            return '';
        }
    };
    return (
        <div>
            <Head>
                <title>patient details</title>
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
                    loading ?
                        <div className={styles.loadingArea}>
                            <SyncLoader color='#36D7B7' size="12" />
                        </div> :
                        <div className='list-area'>
                            <table className='table table-hover table-bordered'>
                                <thead>
                                    <tr>
                                        <th
                                            className='text-success'
                                            colSpan='2'
                                            style={{ fontSize: '24px' }}>
                                            <span className='text-uppercase'>Patient information</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className='fw-bold text-uppercase'>Patient ID: {String(data?.patient.id).padStart(5, '0')}</td>
                                        <td className='fw-bold text-uppercase'>age: {data?.patient.age}</td>
                                    </tr>
                                    <tr>
                                        <td className='fw-bold text-uppercase'>Name: {data?.patient.name}</td>
                                        <td className='fw-bold text-uppercase'>Phone: {data?.patient.phone}</td>
                                    </tr>
                                    <tr>
                                        <td className='fw-bold text-uppercase'>Address: {data?.patient.address}</td>
                                        <td className='fw-bold text-uppercase'>Gender: {data?.patient.gender ?? '--'}</td>
                                    </tr>
                                </tbody>
                            </table>

                            <div className='mt-5'>
                                <h4 className='fw-bold text-uppercase text-success mb-4'>medical history</h4>
                                {
                                    data?.prescriptions?.length > 0 ?
                                        data?.prescriptions?.map((pres, index) => (
                                            <div
                                                key={index}
                                                className='p-3 mb-4'
                                                style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }}>
                                                <div
                                                    style={{ border: "1px solid lightGray", padding: "12px 10px" }}
                                                    className='h5 fw-bold'>
                                                    {pres.doctor_name}
                                                </div>
                                                <div className="row py-2">
                                                    <div className="col-md-5">
                                                        <div dangerouslySetInnerHTML={{ __html: extractHistoryHTML(pres.history) }} />
                                                    </div>
                                                    <div className="col-md-7">
                                                        <div dangerouslySetInnerHTML={{ __html: extractMedicationHTML(pres.medication) }} />
                                                    </div>
                                                </div>
                                            </div>
                                        )) :
                                        <div
                                            className='d-flex justify-content-center align-items-center'
                                            style={{ height: "33vh" }}>
                                            <h5 className='fw-bold text-danger'>no medical history found!</h5>
                                        </div>
                                }
                            </div>
                        </div>
                }
            </div >
        </div >
    );
};

export default PatientDetails;
PatientDetails.getLayout = function getLayout(page) {
    return <AdministratorLayout>{page}</AdministratorLayout>;
};