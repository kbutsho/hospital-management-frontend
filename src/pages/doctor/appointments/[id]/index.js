import Breadcrumb from "@/components/breadcrumb";
import { APPOINTMENT_STATUS } from "@/constant";
import { errorHandler } from "@/helpers/errorHandler";
import DoctorLayout from "@/layouts/doctor/DoctorLayout";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import styles from "@/styles/administrator/List.module.css"
import Cookies from "js-cookie";
import { useState } from "react";
import { config } from "@/config";
import { ImCross } from "react-icons/im";

const AppointmentDetails = () => {
    const router = useRouter();
    const { id } = router.query;
    const token = Cookies.get('token');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

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
                    <h2>patient details coming soon...</h2>
                    <button onClick={handelPrescribe} className="btn btn-primary text-uppercase fw-bold">prescribe</button>
                </div>
            </div>
        </div>
    );
};

export default AppointmentDetails;
AppointmentDetails.getLayout = function getLayout(page) {
    return <DoctorLayout>{page}</DoctorLayout>;
};