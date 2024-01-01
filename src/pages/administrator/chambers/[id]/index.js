import Breadcrumb from '@/components/breadcrumb';
import AdministratorLayout from '@/layouts/administrator/AdministratorLayout';
import axios from 'axios';
import Cookies from 'js-cookie';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { config } from '@/config';
import { errorHandler } from '@/helpers/errorHandler';
import { ImCross } from 'react-icons/im';
import { Table } from 'react-bootstrap';

const ChamberDetails = () => {
    const router = useRouter();
    const { id } = router.query;
    const token = Cookies.get('token');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchChamberDetails = async () => {
            try {
                setLoading(true)
                if (id) {
                    const response = await axios.get(`${config.api}/administrator/chamber/${id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                    console.log(response)
                    setData(response.data.data)
                }
            } catch (error) {
                console.log(error)
                return errorHandler({ error, setErrorMessage })
            } finally {
                setLoading(false)
            }
        }
        fetchChamberDetails()
    }, [id])


    const convertTime = (time24) => {
        const [hours, minutes] = time24.split(':');
        let formattedTime = '';
        let suffix = hours >= 12 ? 'PM' : 'AM';
        let hours12 = hours % 12 || 12;
        formattedTime = `${hours12}:${minutes} ${suffix}`;
        return formattedTime;
    };
    const renderDoctorSchedules = () => {
        if (!data || !data.schedules) return null;

        // Group schedules by doctor and day
        const doctorSchedules = {};
        data.schedules.forEach((schedule) => {
            const { doctor_id, day, opening_time, closing_time, doctor } = schedule;
            if (!doctorSchedules[doctor_id]) {
                doctorSchedules[doctor_id] = {};
            }
            if (!doctorSchedules[doctor_id][day]) {
                doctorSchedules[doctor_id][day] = [];
            }
            doctorSchedules[doctor_id][day].push({ opening_time, closing_time, doctor });
        });

        return Object.entries(doctorSchedules).map(([doctorId, schedules]) => (
            <div key={doctorId} className="col-md-6">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title fw-bold btn btn-primary w-100 text-white">{schedules[Object.keys(schedules)[0]][0].doctor.name}</h5>
                        <Table bordered striped>
                            <tbody>
                                {Object.entries(schedules).map(([day, timings]) => (
                                    <tr key={day}>
                                        <td><strong className='text-capitalize'>{day}</strong> </td>
                                        <td>{timings.map((time) => `${convertTime(time.opening_time)} - ${convertTime(time.closing_time)}`).join(', ')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </div>
            </div>
        ));
    };




    const handelErrorMessage = () => {
        setErrorMessage(null)
    }
    return (
        <div >
            <Head>
                <title>chambers details</title>
            </Head>
            <Breadcrumb name={data?.room} />
            <div className='px-2 py-2' style={{ minHeight: "70vh" }}>
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
                <div className='row'>
                    {renderDoctorSchedules()}
                </div>
            </div>

        </div>
    );
};

export default ChamberDetails;
ChamberDetails.getLayout = function getLayout(page) {
    return <AdministratorLayout>{page}</AdministratorLayout>;
};