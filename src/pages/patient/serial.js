import styles from '@/styles/signup/signup.module.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { AiFillStar } from 'react-icons/ai';
import { config } from '@/config';


const PatientSerial = () => {
    const [phone, setPhone] = useState('');
    const [activeTab, setActiveTab] = useState('doctor');
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        age: '',
        address: '',
        doctor_id: '',
        datetime: '',
        errors: []
    })

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


    const isPatientFound = setFormData.name && setFormData.phone && setFormData.age && setFormData.address;

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
                        <div className={`${styles.navTab}`} style={{ marginBottom: "30px", gap: "20px" }}>
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
                            <div className='row'>
                                <div className="col-md-6">
                                    <div className="form-group mb-3">
                                        <label className='mb-2'>
                                            <span className='fw-bold text-uppercase'>Select Doctor</span>
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
                                            <span className='fw-bold text-uppercase'>Choose schedule</span>
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

// phone
// name
// age
// doctor_id
// time
