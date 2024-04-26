import Breadcrumb from "@/components/breadcrumb";
import { APPOINTMENT_STATUS } from "@/constant";
import { errorHandler } from "@/helpers/errorHandler";
import DoctorLayout from "@/layouts/doctor/DoctorLayout";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import styles from "@/styles/administrator/List.module.css"
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { config } from "@/config";
import { ImCross } from "react-icons/im";
import { toast } from "react-toastify";
import { SyncLoader } from "react-spinners";

const AppointmentDetails = () => {
    const router = useRouter();
    const { id } = router.query;
    const token = Cookies.get('token');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [data, setData] = useState(null)

    const fetchData = async () => {
        try {
            if (id) {
                setLoading(true)
                const res = await axios.get(`${config.api}/doctor/appointment/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                console.log(res.data)
                setLoading(false)
                setData(res.data.data)
            }
        } catch (error) {
            console.log(error)
            setLoading(false)
            errorHandler({ error, toast, setErrorMessage })
        }
    }
    useEffect(() => {
        fetchData()
    }, [id])

    const handelPrescribe = async () => {
        try {
            setLoading(true)
            const data = {
                id: id,
                status: APPOINTMENT_STATUS.IN_PROGRESS
            }
            const response = await axios.post(`${config.api}/doctor/appointment/update/status`, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log(response)
            if (response.data.status) {
                router.push(`/doctor/prescriptions/${id}`);
            }

        } catch (error) {
            console.log(error)
            errorHandler({ error, setErrorMessage })
        } finally {
            setLoading(false)
        }
    }
    const handelErrorMessage = () => {
        setErrorMessage(null)
    }
    return (
        <div>
            <Head>
                <title>appointment details</title>
            </Head>
            <Breadcrumb />
            <div className='px-2'>
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
                    {loading ?
                        <div className={styles.loadingArea}>
                            <SyncLoader
                                color='#36D7B7' size="12" />
                        </div> :
                        <div className={styles.loadingArea} style={{ color: "black" }}>
                            <div>
                                <h4>PATIENT NAME: {data?.name}</h4>
                                <h5>AGE: {data?.phone}</h5>
                                <h5>GENDER: {data?.age}</h5>
                                <h5>ADDRESS: {data?.address}</h5>
                                <h5>PAYMENT_STATUS: {data?.payment_status}</h5>
                                <button
                                    onClick={handelPrescribe}
                                    style={{ borderRadius: "2px" }}
                                    className="btn btn-primary text-uppercase fw-bold mt-3">
                                    prescribe
                                </button>
                            </div>
                        </div>}
                </div>
            </div>
        </div>
    );
};

export default AppointmentDetails;
AppointmentDetails.getLayout = function getLayout(page) {
    return <DoctorLayout>{page}</DoctorLayout>;
};