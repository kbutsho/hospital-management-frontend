import styles from '@/styles/signup/signup.module.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { AiFillStar } from 'react-icons/ai';
import { config } from '@/config';
import Select from 'react-select';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addMonths } from 'date-fns';

const PatientSerial = ({ data }) => {
    console.log(data)
    const [phone, setPhone] = useState('');
    const [activeTab, setActiveTab] = useState('doctor');
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        age: '',
        address: '',
        doctor_id: '',
        datetime: '',
        // schedule_id need to add
        errors: []
    })
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const doctorOptions = data?.data?.doctors.map((doctor, index) => ({
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

    const [selectedVisitingHour, setSelectedVisitingHour] = useState(null);
    const visitingHourOptions = doctorVisitingHours?.map((hour, index) => ({
        value: `${hour.day} ${convertTime(hour.opening_time).split(":").map(part => part.padStart(2, '0')).join(" : ")} 
        - ${convertTime(hour.closing_time).split(":").map(part => part.padStart(2, '0')).join(" : ")}`,
        label: `${hour.day} ${convertTime(hour.opening_time).split(":").map(part => part.padStart(2, '0')).join(" : ")} 
        - ${convertTime(hour.closing_time).split(":").map(part => part.padStart(2, '0')).join(" : ")}`
    }));










    const handlePhoneChange = (event) => {
        setPhone(event.target.value);
    };
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };
    const handleBlur = async () => {
        try {
            const response = await axios.get(`${config.api}/patient/${phone}`);
            if (response.data.data) {
                const { name, phone, age, address } = response.data.data;
                setFormData(prevData => ({
                    ...prevData,
                    name: name || '',
                    phone: phone || '',
                    age: age || '',
                    address: address || '',
                    doctor_id: '',
                    datetime: '',
                    errors: []
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

    const customDateClass = date => {
        if (filterAvailableDates(date)) {
            return 'available-date';
        }
        return 'unavailable-date';
    };
    return (
        <div className={styles.body}>
            <div className={styles.main}>
                <div className={styles.box}>
                    <h4 className={styles.heading}>take a serial</h4>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group mb-3">
                                <label className='mb-2'>
                                    <span className='fw-bold text-uppercase'>Phone</span>
                                    <AiFillStar className='required' />
                                </label>
                                <input
                                    type="text"
                                    className='form-control'
                                    value={phone}
                                    onChange={handlePhoneChange}
                                    onBlur={handleBlur}
                                />
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
                                    className='form-control'
                                    style={{ cursor: !phone ? 'not-allowed' : 'auto' }}
                                />
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
                                    className='form-control'
                                    style={{ cursor: !phone ? 'not-allowed' : 'auto' }}
                                />
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
                                    className='form-control'
                                    style={{ cursor: !phone ? 'not-allowed' : 'auto' }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className='mt-3'>
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
                                                <span className='fw-bold text-uppercase'>Select Doctor</span>
                                                <AiFillStar className='required' />
                                            </label>
                                            <div
                                                style={{
                                                    fontSize: "14px",
                                                    textTransform: "uppercase",
                                                    cursor: !(isPatientFound) ? 'not-allowed' : 'auto'
                                                }}>
                                                <Select
                                                    value={selectedDoctor}
                                                    isDisabled={!(isPatientFound)}
                                                    options={doctorOptions}
                                                    placeholder="search or select doctor"
                                                    // menuPlacement="top"
                                                    onChange={(selectedOption) => {
                                                        setSelectedDoctor(selectedOption)
                                                        setSelectedDate(null)
                                                        setSelectedVisitingHour(null)
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
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label className='mb-2'>
                                                <span className='fw-bold text-uppercase'>Choose Date</span>
                                                <AiFillStar className='required' />
                                            </label>
                                            <div>
                                                <DatePicker
                                                    disabled={!isPatientFound || !selectedDoctor?.value}
                                                    className={`${(!isPatientFound || !selectedDoctor?.value) ? styles.disableDatePicker : styles.enableDatePicker} form-control`}
                                                    placeholderText="SELECT DATE"
                                                    selected={selectedDate}
                                                    minDate={today}
                                                    maxDate={twoMonthsLater}
                                                    onChange={date => setSelectedDate(date)}
                                                    filterDate={filterAvailableDates}
                                                    dayClassName={date => customDateClass(date)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                {
                                    selectedDate ? <div className="row">
                                        <div className="col-md-12">
                                            <div className="form-group mb-3">
                                                <label className='mb-2'>
                                                    <span className='fw-bold text-uppercase'>Select Schedule</span>
                                                    <AiFillStar className='required' />
                                                </label>
                                                <div style={{ textTransform: "uppercase", fontSize: "14px", }}>
                                                    <Select
                                                        value={selectedVisitingHour}
                                                        options={visitingHourOptions}
                                                        placeholder="select schedule"
                                                        onChange={(selectedOption) => {
                                                            setSelectedVisitingHour(selectedOption)
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
                                            </div>
                                        </div>
                                    </div> : null
                                }




                            </div> :
                            <div className='row'>
                                <div className="col-md-6">
                                    <div className="form-group mb-3">
                                        <label className='mb-2'>
                                            <span className='fw-bold text-uppercase'>Select Date</span>
                                            <AiFillStar className='required' />
                                        </label>
                                        <input
                                            type="text"
                                            disabled={!(isPatientFound)}
                                            className='form-control'
                                            style={{ cursor: !(isPatientFound) ? 'not-allowed' : 'auto' }}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group mb-3">
                                        <label className='mb-2'>
                                            <span className='fw-bold text-uppercase'>Choose Doctor</span>
                                            <AiFillStar className='required' />
                                        </label>
                                        <div >
                                            <input
                                                type="text"
                                                disabled={!(isPatientFound)}
                                                className='form-control'
                                                style={{ cursor: !(isPatientFound) ? 'not-allowed' : 'auto' }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>


                    <input type="button" className='btn btn-primary w-100 mt-3 fw-bold' value="submit" />
                </div>
            </div>
        </div>
    );
};

export default PatientSerial;

export async function getStaticProps() {
    try {
        const response = await fetch(`${config.api}/serial/doctor-schedule`);

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