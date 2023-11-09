import styles from '@/styles/signup/signup.module.css';
import { AiFillStar } from "react-icons/ai";
import Link from 'next/link';
import Tabs from './Tabs';
import { ROLE } from '@/constant';
import axios from 'axios';
import { config } from '@/config';
import { BeatLoader } from 'react-spinners';
import { useState } from 'react';
import { toast } from 'react-toastify';


const PatientSignup = ({ activeComponent, handleTabClick }) => {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        age: '',
        gender: '',
        address: '',
        blood_group_id: '',
        emergency_contact_number: '',
        emergency_contact_name: '',
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
        });
    };
    const formSubmit = async (event) => {
        event.preventDefault();
        try {
            setLoading(!loading);
            const data = {
                name: formData.name,
                phone: formData.phone,
                age: formData.age,
                gender: formData.gender,
                address: formData.address,
                blood_group_id: formData.blood_group_id,
                emergency_contact_number: formData.emergency_contact_number,
                emergency_contact_name: formData.emergency_contact_name,
                role: ROLE.PATIENT
            }
            const response = await axios.post(`${config.api}/signup/patient`, data);
            if (response.data.status) {
                setLoading(false);
                setFormData({
                    name: '',
                    phone: '',
                    age: '',
                    gender: '',
                    address: '',
                    blood_group_id: '',
                    emergency_contact_number: '',
                    emergency_contact_name: '',
                    errors: []
                });
                toast.success(response.data.message)
            }
        } catch (error) {
            setLoading(false);
            if (error.response) {
                setFormData({
                    ...formData,
                    errors: error.response.data.error
                });
                toast.error(error.response.data.message)
            }
            else if (error.isAxiosError) {
                toast.error("network error. try again later!");
            }
            else {
                toast.error("unexpected error. try again later!");
            }
        }
    }
    return (
        <div className={styles.body}>
            <div className={styles.main}>
                <div className={styles.box}>
                    <Tabs activeComponent={activeComponent} handleTabClick={handleTabClick} />
                    <h4 className={styles.heading}>patient signup</h4>
                    <form onSubmit={formSubmit}>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group mb-3">
                                    <label className='mb-2'>
                                        <span className='fw-bold'>Name</span>
                                        <AiFillStar className='required' />
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder='your name'
                                        value={formData.name}
                                        onChange={handelInputChange}
                                        className={`form-control ${formData.errors?.name ? 'is-invalid' : null}`}
                                    />
                                    <small className='validation-error'>
                                        {
                                            formData.errors?.name ? formData.errors?.name : null
                                        }
                                    </small>
                                </div>

                                <div className="form-group mb-3">
                                    <label className='mb-2'>
                                        <span className='fw-bold'>Phone</span>
                                        <AiFillStar className='required' />
                                    </label>
                                    <input
                                        type="text"
                                        name="phone"
                                        placeholder='your phone'
                                        value={formData.phone}
                                        onChange={handelInputChange}
                                        className={`form-control ${formData.errors?.phone ? 'is-invalid' : null}`}
                                    />
                                    <small className='validation-error'>
                                        {
                                            formData.errors?.phone ? formData.errors?.phone : null
                                        }
                                    </small>
                                </div>
                                <div className="form-group mb-3">
                                    <label className='mb-2'>
                                        <span className='fw-bold'>Age (Years)</span>
                                        <AiFillStar className='required' />
                                    </label>
                                    <input
                                        type="number"
                                        name="age"
                                        placeholder='your age'
                                        value={formData.age}
                                        onChange={handelInputChange}
                                        className={`form-control ${formData.errors?.age ? 'is-invalid' : null}`}
                                    />
                                    <small className='validation-error'>
                                        {
                                            formData.errors?.age ? formData.errors?.age : null
                                        }
                                    </small>
                                </div>
                                <div className="form-group mb-3">
                                    <label className='mb-2'>
                                        <span className='fw-bold'>Select gender</span>
                                        <AiFillStar className='required' />
                                    </label>
                                    <input
                                        type="text"
                                        name="gender"
                                        placeholder='select gender'
                                        value={formData.gender}
                                        onChange={handelInputChange}
                                        className={`form-control ${formData.errors?.gender ? 'is-invalid' : null}`}
                                    />
                                    <small className='validation-error'>
                                        {
                                            formData.errors?.gender ? formData.errors?.gender : null
                                        }
                                    </small>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group mb-3">
                                    <label className='mb-2'>
                                        <span className='fw-bold'>Address</span>
                                        <AiFillStar className='required' />
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        placeholder='your address'
                                        value={formData.address}
                                        onChange={handelInputChange}
                                        className={`form-control ${formData.errors?.address ? 'is-invalid' : null}`}
                                    />
                                    <small className='validation-error'>
                                        {
                                            formData.errors?.address ? formData.errors?.address : null
                                        }
                                    </small>
                                </div>
                                <div className="form-group mb-3">
                                    <label className='mb-2'>
                                        <span className='fw-bold'>Select blood group</span>
                                        <AiFillStar className='required' />
                                    </label>
                                    <input
                                        type="text"
                                        name="blood_group_id"
                                        placeholder='select blood group'
                                        value={formData.blood_group_id}
                                        onChange={handelInputChange}
                                        className={`form-control ${formData.errors?.blood_group_id ? 'is-invalid' : null}`}
                                    />
                                    <small className='validation-error'>
                                        {
                                            formData.errors?.blood_group_id ? formData.errors?.blood_group_id : null
                                        }
                                    </small>
                                </div>
                                <div className="form-group mb-3">
                                    <label className='mb-2'>
                                        <span className='fw-bold'>Emergency contact name</span>
                                        <AiFillStar className='required' />
                                    </label>
                                    <input
                                        type="text"
                                        name="emergency_contact_name"
                                        placeholder='emergency contact name'
                                        value={formData.emergency_contact_name}
                                        onChange={handelInputChange}
                                        className={`form-control ${formData.errors?.emergency_contact_name ? 'is-invalid' : null}`}
                                    />
                                    <small className='validation-error'>
                                        {
                                            formData.errors?.emergency_contact_name ? formData.errors?.emergency_contact_name : null
                                        }
                                    </small>
                                </div>
                                <div className="form-group mb-3">
                                    <label className='mb-2'>
                                        <span className='fw-bold'>Emergency contact number</span>
                                        <AiFillStar className='required' />
                                    </label>
                                    <input
                                        type="text"
                                        name="emergency_contact_number"
                                        placeholder='emergency contact number'
                                        value={formData.emergency_contact_number}
                                        onChange={handelInputChange}
                                        className={`form-control ${formData.errors?.emergency_contact_number ? 'is-invalid' : null}`}
                                    />
                                    <small className='validation-error'>
                                        {
                                            formData.errors?.emergency_contact_number ? formData.errors?.emergency_contact_number : null
                                        }
                                    </small>
                                </div>
                            </div>
                        </div>
                        <div className="form-group my-2">
                            <button
                                type="submit"
                                className='btn btn-primary w-100 fw-bold'
                                disabled={loading}>
                                {
                                    loading ?
                                        <BeatLoader color={'#fff'} loading={true} size={10} />
                                        : <span>submit</span>
                                }
                            </button>
                        </div>
                        <div className='d-flex justify-content-between'>
                            <div>
                                <span className='small'>
                                    <Link href="/home" className='link'>Home</Link>
                                </span>
                            </div>
                            <div>
                                <span className='small'>
                                    <span className='me-1'>already have an account? </span>
                                    <Link href="/login" className='link'>login here</Link>
                                </span>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PatientSignup;
