import styles from '@/styles/signup/signup.module.css';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { AiFillStar } from 'react-icons/ai';
import { config } from '@/config';
import Select from 'react-select';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addMonths } from 'date-fns';
import { errorHandler } from '@/helpers/errorHandler';
import { toast } from 'react-toastify';
import { Table } from 'react-bootstrap';
import ReactToPrint from 'react-to-print';
import Head from 'next/head';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import Aos from 'aos';


const PatientSerial = ({ data, errorMessage }) => {
    useEffect(() => {
        if (errorMessage) {
            toast.error(errorMessage)
        }
    }, [errorMessage])
    const ref = useRef()
    const [phone, setPhone] = useState('');
    const [activeTab, setActiveTab] = useState('doctor');
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        age: '',
        address: '',
        doctor_id: '',
        errors: []
    })

    const [selectDepartment, setSelectDepartment] = useState(null);
    const departmentOptions = data?.data?.departments.map((dept, index) => ({
        value: dept.id,
        label: dept.name
    }))

    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const doctorOptions = data?.data?.doctors
        .filter(doctor => doctor.department_id === selectDepartment?.value)
        .map((doctor, index) => ({
            value: doctor.id,
            label: doctor.name
        }));

    const doctorSchedules = data?.data?.schedules.filter(schedule => schedule.doctor_id === selectedDoctor?.value);
    const today = new Date();
    const twoMonthsLater = addMonths(today, 1);
    const [selectedDate, setSelectedDate] = useState(null);
    const availableDays = doctorSchedules?.map(schedule => schedule.day.toLowerCase());
    const filterAvailableDates = date => {
        const day = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        return availableDays?.includes(day);
    };

    const dayList = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const doctorVisitingHours = doctorSchedules?.filter(hour => hour.day === dayList[selectedDate?.getDay()]);

    const convertTime = (time24) => {
        const [hours, minutes] = time24.split(':');
        let formattedTime = '';
        let suffix = hours >= 12 ? 'PM' : 'AM';
        let hours12 = hours % 12 || 12;
        formattedTime = `${hours12}:${minutes} ${suffix}`;
        return formattedTime;
    };
    const getTime = (time) => {
        const formattedTime = convertTime(time).split(":").map(part => part.padStart(2, '0')).join(":")
        return formattedTime
    }
    const [selectedVisitingHour, setSelectedVisitingHour] = useState(null);
    const visitingHourOptions = doctorVisitingHours?.map((hour, index) => ({
        value: `${hour.id}`,
        label: `${hour.day} ${getTime(hour.opening_time)} - ${getTime(hour.closing_time)}`
    }));



    // choose by date

    // get all doctor_id from schedules
    const scheduleOptionsByDate = data?.data?.schedules.filter(schedule => schedule.day === dayList[selectedDate?.getDay()])
    const uniqueDoctorIds = [...new Set(scheduleOptionsByDate?.map(schedule => schedule.doctor_id))];

    // getDoctor options
    const getDoctorOptionForChooseByDate = data?.data?.doctors
        .filter(doctor => uniqueDoctorIds.includes(doctor.id))
        .map((doctor, index) => ({
            value: doctor.id,
            label: doctor.name
        }));

    const getScheduleOptionsByDate = scheduleOptionsByDate?.filter(schedule => schedule.doctor_id === selectedDoctor?.value)
        .map(hour => ({
            value: `${hour.id} ${hour.day} ${getTime(hour.opening_time)} ${getTime(hour.closing_time)}`,
            label: `${hour.day} ${getTime(hour.opening_time)} - ${getTime(hour.closing_time)}`
        }));

    const handlePhoneChange = (event) => {
        setPhone(event.target.value);
        setFormData({
            ...formData,
            errors: {
                ...formData.errors,
                phone: null
            }
        });
    };
    const handleTabClick = (tab) => {
        setActiveTab(tab);
        setSelectDepartment(null);
        setSelectedDate(null)
        setSelectedDoctor(null)
        setSelectedVisitingHour(null)
    };
    const handleBlur = async () => {
        try {
            const response = await axios.get(`${config.api}/patient/${phone}`);
            if (response.data.data) {
                const { name, phone, age, address } = response.data.data;
                setFormData(prevData => ({
                    ...prevData,
                    name: name ?? '',
                    phone: phone ?? '',
                    age: age ?? '',
                    address: address ?? '',
                    errors: prevData.errors
                }));
            }
        } catch (error) {
            console.log(error)
        }
    };
    const isPatientFound = formData.name && formData.phone && formData.age && formData.address;
    const handelPatientData = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
            errors: {
                ...formData.errors,
                [event.target.name]: null
            }
        });
    }
    useEffect(() => {
        setFormData((prevData) => ({
            ...prevData,
            phone: phone
        }));
    }, [phone]);
    const [serialData, setSerialData] = useState(null)
    const handelFormSubmit = async () => {
        try {
            const data = {
                name: formData.name,
                phone: formData.phone,
                address: formData.address,
                age: formData.age,
                department_id: selectDepartment?.value,
                doctor_id: selectedDoctor?.value,
                date: selectedDate,
                schedule_id: selectedVisitingHour?.value
            }
            const response = await axios.post(`${config.api}/patient/serial/create`, data);
            setFormData({
                name: '',
                phone: '',
                age: '',
                address: '',
                errors: []
            })
            setPhone('')
            setSelectDepartment(null);
            setSelectedDoctor(null);
            setSelectedDate(null)
            setSelectedVisitingHour(null)
            console.log(response.data.data)
            setSerialData(response.data.data)
            toast.success("serial taken successfully!")
        } catch (error) {
            console.log(error)
            errorHandler({ error, formData, setFormData, toast })
        }
    }

    const customDateClass = date => {
        if (filterAvailableDates(date)) {
            return 'available-date';
        }
        return 'unavailable-date';
    };
    const info = useSelector(state => state.site_info.data);
    useEffect(() => {
        Aos.init({ duration: 1000 });
    }, []);
    return (
        <div>
            <Head>
                <title>take a serial</title>
            </Head>
            {serialData ?
                <div className="container pt-5 pb-4">
                    <div className='d-flex justify-content-end px-3'>
                        <div className='mb-2'>
                            <ReactToPrint trigger={() =>
                                <button className='btn btn-primary fw-bold px-4 text-uppercase me-2'>Print</button>}
                                content={() => ref.current} />
                            <button
                                className='btn btn-secondary fw-bold text-uppercase'
                                onClick={() => {
                                    setSerialData(null)
                                }}>
                                take a new serial
                            </button>
                        </div>
                    </div>
                    <div ref={ref} className='p-3'>
                        <div className='p-3 m-3'>
                            <div>
                                <h4 className='text-center fw-bold text-success text-uppercase mb-3'>{info?.organization_name}</h4>
                                <h6 className='text-center fw-bold mb-3'>{info?.address}</h6>
                            </div>
                            <Table striped hover bordered responsive size="sm" >
                                <tbody>
                                    <tr>
                                        <td className='text-uppercase p-2 fw-bold'>serial id</td>
                                        <td className='p-2'>{serialData ? String(serialData?.id).padStart(5, '0') : null}</td>
                                    </tr>
                                    <tr>
                                        <td className='text-uppercase p-2 fw-bold'>serial no</td>
                                        <td className='p-2 text-uppercase fw-bold'
                                            style={{ color: "red" }}>
                                            pending
                                        </td>
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
                                        <td className='p-2 text-uppercase'>{serialData?.departmentName}</td>
                                    </tr>
                                    <tr>
                                        <td className='text-uppercase p-2 fw-bold'>doctor name</td>
                                        <td className='p-2'>{serialData?.doctorName}</td>
                                    </tr>
                                    <tr>
                                        <td className='text-uppercase p-2 fw-bold'>appointment date</td>
                                        <td className='p-2'>
                                            {serialData?.date?.split("-").reverse().join("/")}
                                            <span className='text-uppercase mx-2'>{serialData?.day}</span>
                                            {convertTime(serialData?.openingTime)}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='text-uppercase p-2 fw-bold'>room number</td>
                                        <td className='p-2'>{serialData?.roomNumber}</td>
                                    </tr>
                                    <tr>
                                        <td className='text-uppercase p-2 fw-bold'>consultation fee</td>
                                        <td className='p-2'>{serialData?.fees} BDT</td>
                                    </tr>
                                    <tr>
                                        <td className='text-uppercase p-2 fw-bold'>payment status</td>
                                        <td className='p-2 text-uppercase fw-bold'
                                            style={{ color: serialData?.paymentStatus === 'unpaid' ? 'red' : 'black' }}>
                                            {serialData?.paymentStatus}
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </div>
                    </div>
                    <div className='d-flex justify-content-end'>

                    </div>
                </div>
                :
                <div className={styles.body}>
                    <div className={styles.main}>
                        <div className={styles.box} data-aos="zoom-in">
                            <div className='d-flex justify-content-between'>
                                <h4 className={styles.heading}>take a patient serial</h4>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group mb-3">
                                        <label className='mb-2'>
                                            <span className='fw-bold text-uppercase'>Phone</span>
                                            <AiFillStar className='required' />
                                        </label>
                                        <input
                                            type="text"
                                            value={phone}
                                            onChange={handlePhoneChange}
                                            onBlur={handleBlur}
                                            placeholder='patient phone number'
                                            className='form-control text-uppercase'
                                            style={{ fontSize: "14px" }}
                                        />
                                        <small className='validation-error'>
                                            {
                                                formData?.errors?.phone ? formData?.errors?.phone : null
                                            }
                                        </small>
                                    </div>
                                    <div className="form-group mb-3">
                                        <label className='mb-2'>
                                            <span className='fw-bold text-uppercase'>Address</span>
                                            <AiFillStar className='required' />
                                        </label>
                                        <input
                                            type="text"
                                            name="address"
                                            disabled={!phone}
                                            value={formData.address}
                                            onChange={handelPatientData}
                                            placeholder='patient address'
                                            className='form-control text-uppercase'
                                            style={{ cursor: !phone ? 'not-allowed' : 'auto', fontSize: "14px" }}
                                        />
                                        <small className='validation-error'>
                                            {
                                                formData?.errors?.address ? formData?.errors?.address : null
                                            }
                                        </small>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group mb-3">
                                        <label className='mb-2'>
                                            <span className='fw-bold text-uppercase'>Name</span>
                                            <AiFillStar className='required' />
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            disabled={!phone}
                                            value={formData.name}
                                            onChange={handelPatientData}
                                            placeholder='patient name'
                                            className='form-control text-uppercase'
                                            style={{ cursor: !phone ? 'not-allowed' : 'auto', fontSize: "14px" }}
                                        />
                                        <small className='validation-error'>
                                            {
                                                formData?.errors?.name ? formData?.errors?.name : null
                                            }
                                        </small>
                                    </div>
                                    <div className="form-group mb-3">
                                        <label className='mb-2'>
                                            <span className='fw-bold text-uppercase'>Age (Years)</span>
                                            <AiFillStar className='required' />
                                        </label>
                                        <input
                                            type="number"
                                            name="age"
                                            disabled={!phone}
                                            value={formData.age}
                                            onChange={handelPatientData}
                                            placeholder='patient age'
                                            className='form-control text-uppercase'
                                            style={{ cursor: !phone ? 'not-allowed' : 'auto', fontSize: '14px' }}
                                        />
                                        <small className='validation-error'>
                                            {
                                                formData?.errors?.age ? formData?.errors?.age : null
                                            }
                                        </small>
                                    </div>
                                </div>
                            </div>
                            <div className='my-3'>
                                <div className={`${styles.navTab}`} style={{ marginBottom: "28px", gap: "20px" }}>
                                    <div className={`${styles.navItem}`}
                                        style={{ cursor: !(isPatientFound) ? 'not-allowed' : 'pointer' }}>
                                        <div className={`text-uppercase ${activeTab === 'doctor' ? 'active-btn' : 'inactive-btn'}`}
                                            onClick={() => {
                                                if (isPatientFound) {
                                                    handleTabClick('doctor');
                                                }
                                            }}>
                                            choose by doctor
                                        </div>
                                    </div>
                                    <div className={`${styles.navItem}`}
                                        disabled={!(isPatientFound)}
                                        style={{ cursor: !(isPatientFound) ? 'not-allowed' : 'pointer' }}>
                                        <div
                                            className={`text-uppercase ${activeTab === 'date' ? 'active-btn' : 'inactive-btn'}`}
                                            onClick={() => {
                                                if (isPatientFound) {
                                                    handleTabClick('date');
                                                }
                                            }}>
                                            choose by date
                                        </div>
                                    </div>
                                </div>

                                {activeTab === 'doctor' ?
                                    <div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label className='mb-2'>
                                                        <span className='fw-bold text-uppercase'>select department</span>
                                                        <AiFillStar className='required' />
                                                    </label>
                                                    <div
                                                        style={{
                                                            fontSize: "14px",
                                                            textTransform: "uppercase",
                                                            cursor: !(isPatientFound) ? 'not-allowed' : 'auto'
                                                        }}>
                                                        <Select
                                                            value={selectDepartment}
                                                            isDisabled={!(isPatientFound)}
                                                            options={departmentOptions}
                                                            placeholder="search or select department"
                                                            onChange={(selectedOption) => {
                                                                setSelectDepartment(selectedOption)
                                                                setSelectedDoctor(null)
                                                                setSelectedDate(null)
                                                                setSelectedVisitingHour(null)
                                                                setFormData({
                                                                    ...formData,
                                                                    errors: {
                                                                        ...formData.errors,
                                                                        department_id: null
                                                                    }
                                                                });
                                                            }}
                                                            styles={{
                                                                // menu: (provided) => ({
                                                                //     ...provided,
                                                                //     maxHeight: '160px',
                                                                //     overflowY: 'auto',
                                                                // }),
                                                                option: (provided) => ({
                                                                    ...provided,
                                                                    cursor: 'pointer',
                                                                    padding: '4px 16px',
                                                                    textTransform: "uppercase",
                                                                    fontWeight: "bold"
                                                                }),
                                                            }} />
                                                    </div>
                                                    <small className='validation-error'>
                                                        {
                                                            formData?.errors?.department_id ? formData?.errors?.department_id : null
                                                        }
                                                    </small>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label className='mb-2'>
                                                        <span className='fw-bold text-uppercase'>Select Doctor</span>
                                                        <AiFillStar className='required' />
                                                    </label>
                                                    <div
                                                        style={{
                                                            fontSize: "14px",
                                                            textTransform: "uppercase",
                                                            cursor: !isPatientFound || !selectDepartment ? 'not-allowed' : 'auto'
                                                        }}>
                                                        <Select
                                                            value={selectedDoctor}
                                                            isDisabled={!isPatientFound || !selectDepartment?.value}
                                                            options={doctorOptions}
                                                            placeholder="search or select doctor"
                                                            onChange={(selectedOption) => {
                                                                setSelectedDoctor(selectedOption)
                                                                setSelectedDate(null)
                                                                setSelectedVisitingHour(null)
                                                                setFormData({
                                                                    ...formData,
                                                                    errors: {
                                                                        ...formData.errors,
                                                                        doctor_id: null
                                                                    }
                                                                });
                                                            }}
                                                            styles={{
                                                                menu: (provided) => ({
                                                                    ...provided,
                                                                    maxHeight: '160px',
                                                                    overflowY: 'auto',
                                                                }),
                                                                option: (provided) => ({
                                                                    ...provided,
                                                                    cursor: 'pointer',
                                                                    padding: '4px 16px',
                                                                    textTransform: "uppercase",
                                                                    fontWeight: "bold"
                                                                }),
                                                            }} />
                                                    </div>
                                                    <small className='validation-error'>
                                                        {
                                                            formData?.errors?.doctor_id ? formData?.errors?.doctor_id : null
                                                        }
                                                    </small>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label className='mb-2'>
                                                        <span className='fw-bold text-uppercase'>select Date</span>
                                                        <AiFillStar className='required' />
                                                    </label>
                                                    <div>
                                                        <DatePicker
                                                            disabled={!isPatientFound || !selectDepartment?.value || !selectedDoctor?.value}
                                                            className={`${(!isPatientFound || !selectDepartment?.value || !selectedDoctor?.value)
                                                                ? styles.disableDatePicker : styles.enableDatePicker} form-control`}
                                                            placeholderText="SELECT DATE"
                                                            selected={selectedDate}
                                                            minDate={today}
                                                            maxDate={twoMonthsLater}
                                                            onChange={date => {
                                                                setSelectedDate(date)
                                                                setSelectedVisitingHour(null)
                                                                setFormData({
                                                                    ...formData,
                                                                    errors: {
                                                                        ...formData.errors,
                                                                        date: null
                                                                    }
                                                                });
                                                            }}
                                                            filterDate={filterAvailableDates}
                                                            dayClassName={date => customDateClass(date)}
                                                        />
                                                    </div>
                                                    <small className='validation-error'>
                                                        {
                                                            formData?.errors?.date ? formData?.errors?.date : null
                                                        }
                                                    </small>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label className='mb-2'>
                                                        <span className='fw-bold text-uppercase'>select schedule</span>
                                                        <AiFillStar className='required' />
                                                    </label>
                                                    <div style={{
                                                        fontSize: "14px",
                                                        textTransform: "uppercase",
                                                        cursor: !isPatientFound || !selectDepartment?.value || !selectedDoctor?.value || !selectedDate
                                                            ? 'not-allowed' : 'auto'
                                                    }}>
                                                        <Select
                                                            isDisabled={!isPatientFound || !selectDepartment?.value || !selectedDoctor?.value || !selectedDate}
                                                            value={selectedVisitingHour}
                                                            options={visitingHourOptions}
                                                            placeholder="select schedule"
                                                            onChange={(selectedOption) => {
                                                                setSelectedVisitingHour(selectedOption)
                                                                setFormData({
                                                                    ...formData,
                                                                    errors: {
                                                                        ...formData.errors,
                                                                        schedule: null
                                                                    }
                                                                });
                                                            }}
                                                            styles={{
                                                                menu: (provided) => ({
                                                                    ...provided,
                                                                    maxHeight: '160px',
                                                                    overflowY: 'auto',
                                                                }),
                                                                option: (provided) => ({
                                                                    ...provided,
                                                                    cursor: 'pointer',
                                                                    padding: '4px 10px',
                                                                    textTransform: "uppercase",
                                                                    fontSize: "14px",
                                                                    fontWeight: "bold"
                                                                }),
                                                            }} />
                                                    </div>
                                                    <small className='validation-error'>
                                                        {
                                                            formData?.errors?.schedule_id ? formData?.errors?.schedule_id : null
                                                        }
                                                    </small>
                                                </div>
                                            </div>
                                        </div>

                                    </div> :
                                    <div>
                                        <div className='row'>
                                            <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label className='mb-2'>
                                                        <span className='fw-bold text-uppercase'>select department</span>
                                                        <AiFillStar className='required' />
                                                    </label>
                                                    <div
                                                        style={{
                                                            fontSize: "14px",
                                                            textTransform: "uppercase",
                                                            cursor: !(isPatientFound) ? 'not-allowed' : 'auto'
                                                        }}>
                                                        <Select
                                                            value={selectDepartment}
                                                            isDisabled={!(isPatientFound)}
                                                            options={departmentOptions}
                                                            placeholder="search or select department"
                                                            onChange={(selectedOption) => {
                                                                setSelectDepartment(selectedOption)
                                                                setSelectedDoctor(null)
                                                                setSelectedDate(null)
                                                                setSelectedVisitingHour(null)
                                                                setFormData({
                                                                    ...formData,
                                                                    errors: {
                                                                        ...formData.errors,
                                                                        department_id: null
                                                                    }
                                                                });
                                                            }}
                                                            styles={{
                                                                menu: (provided) => ({
                                                                    ...provided,
                                                                    maxHeight: '160px',
                                                                    overflowY: 'auto',
                                                                }),
                                                                option: (provided) => ({
                                                                    ...provided,
                                                                    cursor: 'pointer',
                                                                    padding: '4px 16px',
                                                                    textTransform: "uppercase",
                                                                    fontWeight: "bold"
                                                                }),
                                                            }} />
                                                    </div>
                                                    <small className='validation-error'>
                                                        {
                                                            formData?.errors?.department_id ? formData?.errors?.department_id : null
                                                        }
                                                    </small>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label className='mb-2'>
                                                        <span className='fw-bold text-uppercase'>select Date</span>
                                                        <AiFillStar className='required' />
                                                    </label>
                                                    <div>
                                                        <DatePicker
                                                            disabled={!isPatientFound || !selectDepartment?.value}
                                                            className={`${(!isPatientFound || !selectDepartment?.value)
                                                                ? styles.disableDatePicker : styles.enableDatePicker} form-control`}
                                                            placeholderText="SELECT DATE"
                                                            selected={selectedDate}
                                                            minDate={today}
                                                            maxDate={twoMonthsLater}
                                                            onChange={date => {
                                                                setSelectedDate(date)
                                                                setSelectedDoctor(null)
                                                                setSelectedVisitingHour(null)
                                                                setFormData({
                                                                    ...formData,
                                                                    errors: {
                                                                        ...formData.errors,
                                                                        date: null
                                                                    }
                                                                });
                                                            }}
                                                            dayClassName={() => 'available-date'}
                                                        />
                                                    </div>
                                                    <small className='validation-error'>
                                                        {
                                                            formData?.errors?.date ? formData?.errors?.date : null
                                                        }
                                                    </small>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label className='mb-2'>
                                                        <span className='fw-bold text-uppercase'>Select Doctor</span>
                                                        <AiFillStar className='required' />
                                                    </label>
                                                    <div
                                                        style={{
                                                            fontSize: "14px",
                                                            textTransform: "uppercase",
                                                            cursor: !isPatientFound || !selectDepartment || !selectedDate ? 'not-allowed' : 'auto'
                                                        }}>
                                                        <Select
                                                            value={selectedDoctor}
                                                            isDisabled={!isPatientFound || !selectDepartment?.value || !selectedDate}
                                                            options={getDoctorOptionForChooseByDate}
                                                            placeholder="search or select doctor"
                                                            onChange={(selectedOption) => {
                                                                setSelectedDoctor(selectedOption)
                                                                setSelectedVisitingHour(null)
                                                                setFormData({
                                                                    ...formData,
                                                                    errors: {
                                                                        ...formData.errors,
                                                                        doctor_id: null
                                                                    }
                                                                });
                                                            }}
                                                            styles={{
                                                                menu: (provided) => ({
                                                                    ...provided,
                                                                    maxHeight: '160px',
                                                                    overflowY: 'auto',
                                                                }),
                                                                option: (provided) => ({
                                                                    ...provided,
                                                                    cursor: 'pointer',
                                                                    padding: '4px 16px',
                                                                    textTransform: "uppercase",
                                                                    fontWeight: "bold"
                                                                }),
                                                            }} />
                                                    </div>
                                                    <small className='validation-error'>
                                                        {
                                                            formData?.errors?.doctor_id ? formData?.errors?.doctor_id : null
                                                        }
                                                    </small>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group mb-3">
                                                    <label className='mb-2'>
                                                        <span className='fw-bold text-uppercase'>select schedule</span>
                                                        <AiFillStar className='required' />
                                                    </label>
                                                    <div style={{
                                                        fontSize: "14px",
                                                        textTransform: "uppercase",
                                                        cursor: !isPatientFound || !selectDepartment?.value || !selectedDoctor?.value || !selectedDate
                                                            ? 'not-allowed' : 'auto'
                                                    }}>
                                                        <Select
                                                            isDisabled={!isPatientFound || !selectDepartment?.value || !selectedDoctor?.value || !selectedDate}
                                                            value={selectedVisitingHour}
                                                            options={getScheduleOptionsByDate}
                                                            placeholder="select schedule"
                                                            onChange={(selectedOption) => {
                                                                setSelectedVisitingHour(selectedOption)
                                                                setFormData({
                                                                    ...formData,
                                                                    errors: {
                                                                        ...formData.errors,
                                                                        schedule: null
                                                                    }
                                                                });
                                                            }}
                                                            styles={{
                                                                menu: (provided) => ({
                                                                    ...provided,
                                                                    maxHeight: '160px',
                                                                    overflowY: 'auto',
                                                                }),
                                                                option: (provided) => ({
                                                                    ...provided,
                                                                    cursor: 'pointer',
                                                                    padding: '4px 10px',
                                                                    textTransform: "uppercase",
                                                                    fontSize: "14px",
                                                                    fontWeight: "bold"
                                                                }),
                                                            }} />
                                                    </div>
                                                    <small className='validation-error'>
                                                        {
                                                            formData?.errors?.schedule_id ? formData?.errors?.schedule_id : null
                                                        }
                                                    </small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                            <input type="button" onClick={handelFormSubmit} className='btn btn-primary w-100 fw-bold' value="submit" />
                            <div className='d-flex justify-content-between mt-3'>
                                <small>
                                    <Link className='fw-bold' style={{ textDecoration: "none" }} href="/">Home</Link>
                                </small>
                                <small className='fw-bold'>
                                    <span className=''>already have a serial?</span>
                                    <Link className='ms-1' style={{ textDecoration: "none" }} href="/serial/details">click here</Link>
                                </small>
                            </div>
                        </div>

                    </div>
                </div>
            }
        </div>

    );
};

export default PatientSerial;

export async function getStaticProps() {
    try {
        const response = await fetch(`${config.api}/serial/department-doctor-schedule`);
        console.log(response)
        if (!response.ok) {
            return { props: { data: [], errorMessage: 'internal server error!' } };
        }
        const data = await response.json();
        console.log(data)
        return {
            props: {
                data,
                errorMessage: null,
            },
            revalidate: 30,
        };
    } catch (error) {
        console.log(error)
        return { props: { data: [], errorMessage: 'internal server error!' } };
    }
}