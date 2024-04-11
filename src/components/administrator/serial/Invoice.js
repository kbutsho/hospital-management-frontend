import React from 'react';
import { Table } from 'react-bootstrap';


const Invoice = ({ data, date, serialNumber, patientId, info }) => {
    const convertTime = (time24) => {
        const [hours, minutes] = time24.split(':');
        let formattedTime = '';
        let suffix = hours >= 12 ? 'PM' : 'AM';
        let hours12 = hours % 12 || 12;
        if (hours12 < 10) {
            hours12 = String(hours12).padStart(2, '0')
        }
        formattedTime = `${hours12}:${minutes} ${suffix} `;
        return formattedTime;
    };

    return (
        <div className='p-3 m-3' style={{ width: "816px" }}>
            <div className='py-3'>
                <h4 className='text-center fw-bold'>{info?.organization_name}</h4>
                <h6 className='text-center'>{info?.address}</h6>
            </div>
            <div className='alert alert-success h5 text-uppercase fw-bold text-center'>Appointment Invoice </div>
            <Table striped bordered size="sm" >
                <tbody>
                    <tr>
                        <td className='text-uppercase p-2 fw-bold'>patient id</td>
                        <td className='p-2'>{String(patientId).padStart(5, '0')}</td>
                    </tr>
                    <tr>
                        <td className='text-uppercase p-2 fw-bold'>serial id</td>
                        <td className='p-2'>{String(data.id).padStart(5, '0')}</td>
                    </tr>
                    <tr>
                        <td className='text-uppercase p-2 fw-bold'>serial number</td>
                        <td className='p-2 text-uppercase fw-bold'>{serialNumber}</td>
                    </tr>
                    <tr>
                        <td className='text-uppercase p-2 fw-bold'>patient name</td>
                        <td className='p-2'>{data.name}</td>
                    </tr>
                    <tr>
                        <td className='text-uppercase p-2 fw-bold'>patient phone</td>
                        <td className='p-2'>{data.phone}</td>
                    </tr>
                    <tr>
                        <td className='text-uppercase p-2 fw-bold'>patient age</td>
                        <td className='p-2'>{data.age} YEARS</td>
                    </tr>
                    <tr>
                        <td className='text-uppercase p-2 fw-bold'>department</td>
                        <td className='p-2 text-uppercase'>{data.departmentName}</td>
                    </tr>
                    <tr>
                        <td className='text-uppercase p-2 fw-bold'>doctor name</td>
                        <td className='p-2'>{data.doctorName}</td>
                    </tr>
                    <tr>
                        <td className='text-uppercase p-2 fw-bold'>appointment date</td>
                        <td className='p-2'>
                            {data.date.split("-").reverse().join("/")}
                            <span className='text-uppercase mx-2'>{data.day}</span>
                            {convertTime(data.opening_time)}
                        </td>
                    </tr>
                    <tr>
                        <td className='text-uppercase p-2 fw-bold'>room number</td>
                        <td className='p-2'>{data.roomNumber}</td>
                    </tr>
                    <tr>
                        <td className='text-uppercase p-2 fw-bold'>consultation fee</td>
                        <td className='p-2'>{data.fees} BDT</td>
                    </tr>
                    <tr>
                        <td className='text-uppercase p-2 fw-bold'>payment status</td>
                        <td className='p-2 text-uppercase fw-bold'>
                            {data.payment_status}
                        </td>
                    </tr>
                </tbody>
            </Table>
            <div>
                <h6 className='fw-bold'>General Instructions</h6>
                <ol>
                    <li>Appointment booked online will not be refunded.</li>
                    <li>Change of Department /Unit not allowed.</li>
                    <li>Change in appointment date will be allowed only once.</li>
                    <li>Appointment date change option is available online.</li>
                    <li>Demand Drafts will only be accepted at cash counters.</li>
                    <li>For any query mail to callcentre@cmcvellore.ac.in</li>
                </ol>
            </div>
            <div className='d-flex justify-content-end align-items-baseline'>
                <small style={{ fontSize: "10px" }}>{date}</small>
            </div>
        </div>
    )
}



export default Invoice;
