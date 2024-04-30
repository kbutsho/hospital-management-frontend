import DoctorLayout from '@/layouts/doctor/DoctorLayout';
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
                const res = await axios.get(`${config.api}/doctor/patient/${id}`, {
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
                            <pre>{JSON.stringify(data, null, 2)}</pre>
                        </div>
                }
            </div>
        </div>
    );
};

export default PatientDetails;
PatientDetails.getLayout = function getLayout(page) {
    return <DoctorLayout>{page}</DoctorLayout>;
};