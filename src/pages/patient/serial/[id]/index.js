import { errorHandler } from '@/helpers/errorHandler';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { Table } from 'react-bootstrap';
import ReactToPrint from 'react-to-print';
import { config } from '@/config';

const SerialDetails = () => {
    const ref = useRef()
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState(null)
    const { id } = router.query;
    const [serialData, setSerialData] = useState(null)

    const convertTime = (time24) => {
        if (time24) {
            const [hours, minutes] = time24.split(':');
            let formattedTime = '';
            let suffix = hours >= 12 ? 'PM' : 'AM';
            let hours12 = hours % 12 || 12;
            formattedTime = `${hours12}:${minutes} ${suffix}`;
            return formattedTime;
        }
    };
    useEffect(() => {
        const getSerialInfo = async () => {
            try {
                if (id) {
                    const response = await axios.get(`${config.api}/patient/serial/${id}`);
                    console.log(response)
                    setSerialData(response.data.data)
                }
            } catch (error) {
                console.log(error)
                errorHandler({ error, setErrorMessage })
            }
        }
        getSerialInfo()
    }, [id])
    return (
        <div>
            {errorMessage ?
                <div className='d-flex justify-content-center align-items-center' style={{ height: "100vh" }}>
                    <div className='text-center'>
                        <h5 className='text-danger fw-bold'>no data found</h5>
                        <Link
                            className='btn btn-primary fw-bold'
                            href="/patient/serial" >take a new serial
                        </Link>
                    </div>
                </div> :
                <div className='container pt-5 pb-4'>
                    <div className='d-flex justify-content-end px-3'>
                        <ReactToPrint trigger={() =>
                            <button className='btn btn-primary fw-bold px-4 text-uppercase mb-2'>Print</button>}
                            content={() => ref.current} />
                    </div>
                    <div ref={ref} className='p-3'>
                        <Table striped hover bordered responsive size="sm" >
                            <tbody>
                                <tr>
                                    <td className='text-uppercase p-2 fw-bold'>serial id</td>
                                    <td className='p-2'>{serialData ? String(serialData?.id).padStart(5, '0') : null}</td>
                                </tr>
                                <tr>
                                    <td className='text-uppercase p-2 fw-bold'>serial no</td>
                                    <td className='p-2 text-uppercase fw-bold'
                                        style={{ color: serialData?.serial_no === 'pending' ? 'red' : 'black' }}>
                                        {serialData?.serial_no}</td>
                                </tr>
                                <tr>
                                    <td className='text-uppercase p-2 fw-bold'>patient name</td>
                                    <td className='p-2'>{serialData?.name}</td>
                                </tr>
                                <tr>
                                    <td className='text-uppercase p-2 fw-bold'>patient phone</td>
                                    <td className='p-2'>{serialData?.phone}</td>
                                </tr>
                                <tr>
                                    <td className='text-uppercase p-2 fw-bold'>patient address</td>
                                    <td className='p-2'>{serialData?.address}</td>
                                </tr>
                                <tr>
                                    <td className='text-uppercase p-2 fw-bold'>patient age</td>
                                    <td className='p-2'>{serialData?.age} {serialData ? 'YEARS' : null}</td>
                                </tr>
                                <tr>
                                    <td className='text-uppercase p-2 fw-bold'>department name</td>
                                    <td className='p-2 text-uppercase'>{serialData?.department_name}</td>
                                </tr>
                                <tr>
                                    <td className='text-uppercase p-2 fw-bold'>doctor name</td>
                                    <td className='p-2'>{serialData?.doctor_name}</td>
                                </tr>
                                <tr>
                                    <td className='text-uppercase p-2 fw-bold'>appointment date</td>
                                    <td className='p-2'>
                                        {serialData?.date.split("-").reverse().join("/")}
                                        <span className='text-uppercase mx-2'>{serialData?.day}</span>
                                        {convertTime(serialData?.opening_time)}
                                    </td>
                                </tr>
                                <tr>
                                    <td className='text-uppercase p-2 fw-bold'>room number</td>
                                    <td className='p-2'>{serialData?.room_number}</td>
                                </tr>
                                <tr>
                                    <td className='text-uppercase p-2 fw-bold'>consultation fee</td>
                                    <td className='p-2'>{serialData?.fees} {serialData ? 'BDT' : null}</td>
                                </tr>
                                <tr>
                                    <td className='text-uppercase p-2 fw-bold'>payment status</td>
                                    <td className='p-2 text-uppercase fw-bold'
                                        style={{ color: serialData?.payment_status === 'unpaid' ? 'red' : 'black' }}>
                                        {serialData?.payment_status}
                                    </td>
                                </tr>
                            </tbody>
                        </Table>

                    </div>
                    <div className='d-flex justify-content-end'>
                        <Link
                            style={{ textDecoration: "underline", color: "blue", cursor: "pointer" }}
                            href="/patient/serial" >take a new serial
                        </Link>
                    </div>
                </div>
            }
        </div>
    );
};

export default SerialDetails;