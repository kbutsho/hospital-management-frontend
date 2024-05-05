import { errorHandler } from '@/helpers/errorHandler';
import MainLayout from '@/layouts/MainLayout';
import { useState } from 'react';
import { SyncLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import styles from "@/styles/administrator/List.module.css"
import axios from 'axios';
import { config } from '@/config';
import { Table } from 'react-bootstrap';
import { PAYMENT_STATUS } from '@/constant';
import { useSelector } from 'react-redux';
import Invoice from './invoice';
import html2canvas from 'html2canvas';
import ReactDOM from 'react-dom';
import { useRouter } from 'next/router';

const SerialDetails = () => {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState(null)
    const router = useRouter()
    const [formData, setFormData] = useState({
        searchTerm: '',
        errors: []
    })
    const handelInputChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
            errors: {
                ...formData.errors,
                [event.target.name]: null
            }
        })
    };
    const handelSubmit = async (e) => {
        try {
            setLoading(true)
            const data = {
                searchTerm: formData.searchTerm
            }
            const res = await axios.get(`${config.api}/serial/search`, { params: data })
            console.log(res)
            setLoading(false)
            setData(res.data)
            setFormData({
                searchTerm: '',
                errors: []
            })
        } catch (error) {
            console.log(error)
            setLoading(false)
            errorHandler({ error, toast, formData, setFormData })
        }
    }

    const info = useSelector(state => state.site_info.data);
    const [serialLoading, setSerialLoading] = useState(false);
    const handleInvoiceDownload = async (data) => {
        const element = document.createElement('div');
        element.style.cssText = 'position: absolute; left: -9999px;';
        let link;
        try {
            setSerialLoading(true);
            const response = await axios.get(`${config.api}/serial/${data.id}/serial-number`);
            console.log(response)
            if (response.data) {
                const date = String(new Date());
                const invoiceContent = <Invoice
                    info={info}
                    data={data}
                    date={date}
                    patientId={response.data.patientId}
                    serialNumber={response.data.serialNumber} />;
                ReactDOM.render(invoiceContent, element);
                document.body.appendChild(element);

                const canvas = await html2canvas(element);
                const imageURL = canvas.toDataURL('image/png');
                link = document.createElement('a');
                link.href = imageURL;
                link.download = `invoice.${data.id}.png`;
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();
            }
        }
        catch (error) {
            console.log(error)
            return errorHandler({ error, toast })
        }
        finally {
            setSerialLoading(false);
            if (element && element.parentNode) {
                element.parentNode.removeChild(element);
            }
            if (link && link.parentNode) {
                link.parentNode.removeChild(link);
            }
        }

    };


    const handelPayment = async () => {
        try {
            const res = await axios.post(`${config.backend_api}/pay-via-ajax`)
            console.log(res)
            router.push(res.data.data)

        } catch (error) {
            console.log(error)
            errorHandler({ error, toast })
        }
        // router.push(`${config.backend_api}/payment`)
        // toast("payment method coming soon!")
    }

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

    const statusColors = {
        [PAYMENT_STATUS.UNPAID]: 'red',
        [PAYMENT_STATUS.PAID]: 'green'
    };

    return (
        <div className="container py-4" style={{ minHeight: '100vh', marginTop: "100px" }}>
            <div>
                <label className='fw-bold text-uppercase mb-4'>Search your appointment</label>
                <div className='d-flex'>
                    <input
                        className='form-control'
                        type="text"
                        name="searchTerm"
                        value={formData?.searchTerm}
                        onChange={handelInputChange}
                        style={{ borderRadius: "0px", outline: "none" }}
                        onFocus={(e) => e.target.style.boxShadow = 'none'}
                        onBlur={(e) => e.target.style.boxShadow = 'none'}
                        placeholder='enter your serial id, name or phone number' />
                    <button
                        onClick={handelSubmit}
                        className='btn btn-primary fw-bold'
                        style={{ borderRadius: "0px" }}>
                        search
                    </button>
                </div>
                <small className='validation-error'>
                    {
                        formData?.errors?.searchTerm ? formData?.errors?.searchTerm : null
                    }
                </small>
            </div>
            <div className={`py-3 ${styles.listArea}`}>
                {
                    loading ?
                        <div className={styles.loadingArea}>
                            <SyncLoader
                                color='#36D7B7' size="12px" />
                        </div> :
                        <div className='list-area'>
                            {
                                data ?
                                    <div>
                                        {data.data.length > 0 ?
                                            <div className='p-3 mt-3 table-area'>
                                                <Table responsive bordered size="sm" style={{ fontSize: "13px" }}>
                                                    <thead className='p-3 custom-scrollbar'>
                                                        <tr>
                                                            <th className='text-center'>ID</th>
                                                            <th className='text-center'>NAME</th>
                                                            <th className='text-center'>PHONE</th>
                                                            <th className='text-center'>AGE</th>
                                                            <th className='text-center'>DEPT</th>
                                                            <th className='text-center'>DOCTOR</th>
                                                            <th className='text-center'>SCHEDULE</th>
                                                            <th className='text-center'>FEES</th>
                                                            <th className='text-center'>INVOICE</th>
                                                            <th className='text-center'>STATUS</th>
                                                            <th className='text-center'>ACTION</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className='p-3'>
                                                        {
                                                            data?.data?.map((data, index) => {
                                                                return (
                                                                    <tr key={index}>
                                                                        <td className='text-center table-element'>{String(data.id).padStart(5, '0')}</td>
                                                                        <td className='table-element'>{data.name}</td>
                                                                        <td className='table-element'>{data.phone}</td>
                                                                        <td className='table-element'>{data.age}</td>
                                                                        <td className='table-element'>{data.departmentName}</td>
                                                                        <td className='table-element'>{data.doctorName}</td>
                                                                        <td className='table-element'>{data.date.split('-').reverse().join('/')} {convertTime(data.opening_time)}</td>
                                                                        <td className='table-element'>{data.fees}</td>
                                                                        <td className='table-element text-center'>{data.payment_status === PAYMENT_STATUS.PAID ?
                                                                            <button
                                                                                disabled={serialLoading}
                                                                                onClick={() => handleInvoiceDownload(data)}
                                                                                style={{
                                                                                    color: "white",
                                                                                    background: "#157347",
                                                                                    fontWeight: "bold",
                                                                                    borderRadius: "3px",
                                                                                    border: "none",
                                                                                    padding: "0 9px 3px 9px",
                                                                                    margin: "0 0 5px 0"
                                                                                }}
                                                                            >print</button>
                                                                            : <span className='fw-bold'>--</span>}
                                                                        </td>
                                                                        <td
                                                                            className='text-center fw-bold pt-1'
                                                                            style={{ color: statusColors[data.payment_status] || 'inherit' }}>{data.payment_status}
                                                                        </td>
                                                                        <td className='text-center table-element'>
                                                                            {
                                                                                data.payment_status === 'paid' ?
                                                                                    <span className='fw-bold'>--</span> :
                                                                                    <button
                                                                                        onClick={handelPayment}
                                                                                        style={{
                                                                                            color: "white",
                                                                                            background: "#157347",
                                                                                            fontWeight: "bold",
                                                                                            borderRadius: "3px",
                                                                                            border: "none",
                                                                                            padding: "0 9px 3px 9px",
                                                                                            margin: "0 0 5px 0"
                                                                                        }}>payment</button>
                                                                            }
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            })
                                                        }
                                                    </tbody>
                                                </Table>
                                            </div> :
                                            <div
                                                className='d-flex justify-content-center align-items-center'
                                                style={{ height: "60vh", border: "1px solid lightGray", padding: "12px 10px", background: "white" }}>
                                                <h6 className='fw-bold text-uppercase' style={{ color: "red" }}>no serial found</h6>
                                            </div>}
                                    </div> :
                                    null
                            }
                        </div>
                }
            </div>

        </div>
    );
};

export default SerialDetails;
SerialDetails.getLayout = function getLayout(page) {
    return <MainLayout>{page}</MainLayout>;
};