import React, { useState } from 'react';
import styles from '@/styles/signup/signup.module.css';
import { AiFillStar } from "react-icons/ai";
import { BiHide, BiShow } from "react-icons/bi";
import Link from 'next/link';
import { ROLE } from '@/constant';
import { toast } from 'react-toastify';
import axios from 'axios';
import { config } from '@/config';
import Tabs from './Tabs';
import { BeatLoader } from 'react-spinners';


const AssistantSignup = ({ activeComponent, handleTabClick }) => {
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        doctor_id: '',
        chamber_id: '',
        password: '',
        confirmPassword: '',
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
                email: formData.email,
                address: formData.address,
                doctor_id: formData.doctor_id,
                chamber_id: formData.chamber_id,
                role: ROLE.ASSISTANT,
                password: formData.password,
                confirmPassword: formData.confirmPassword,
            }
            const response = await axios.post(`${config.api}/signup/assistant`, data);
            if (response.data.status) {
                setLoading(false);
                setFormData({
                    name: '',
                    phone: '',
                    email: '',
                    address: '',
                    doctor_id: '',
                    chamber_id: '',
                    password: '',
                    confirmPassword: '',
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
    const showPasswordBtn = () => {
        setShowPassword(!showPassword)
    }
    const showConfirmPasswordBtn = () => {
        setShowConfirmPassword(!showConfirmPassword)
    }
    return (
        <div className={styles.body}>
            <div className={styles.main}>
                <div className={styles.box}>
                    <Tabs activeComponent={activeComponent} handleTabClick={handleTabClick} />
                    <h4 className={styles.heading}>assistant signup</h4>
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
                                        <span className='fw-bold'>Email</span>
                                        <AiFillStar className='required' />
                                    </label>
                                    <input
                                        type="text"
                                        name="email"
                                        placeholder='your email'
                                        value={formData.email}
                                        onChange={handelInputChange}
                                        className={`form-control ${formData.errors?.email ? 'is-invalid' : null}`}
                                    />
                                    <small className='validation-error'>
                                        {
                                            formData.errors?.email ? formData.errors?.email : null
                                        }
                                    </small>
                                </div>
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
                            </div>
                            <div className="col-md-6">
                                <div className="form-group mb-3">
                                    <label className='mb-2'>
                                        <span className='fw-bold'>Select Doctor</span>
                                        <AiFillStar className='required' />
                                    </label>
                                    <input
                                        type="text"
                                        name="doctor_id"
                                        placeholder='select doctor'
                                        value={formData.doctor_id}
                                        onChange={handelInputChange}
                                        className={`form-control ${formData.errors?.doctor_id ? 'is-invalid' : null}`}
                                    />
                                    <small className='validation-error'>
                                        {
                                            formData.errors?.doctor_id ? formData.errors?.doctor_id : null
                                        }
                                    </small>
                                </div>
                                <div className="form-group mb-3">
                                    <label className='mb-2'>
                                        <span className='fw-bold'>Select chamber</span>
                                        <AiFillStar className='required' />
                                    </label>
                                    <input
                                        type="text"
                                        name="chamber_id"
                                        placeholder='select chamber'
                                        value={formData.chamber_id}
                                        onChange={handelInputChange}
                                        className={`form-control ${formData.errors?.chamber_id ? 'is-invalid' : null}`}
                                    />
                                    <small className='validation-error'>
                                        {
                                            formData.errors?.chamber_id ? formData.errors?.chamber_id : null
                                        }
                                    </small>
                                </div>
                                <div className="form-group mb-3">
                                    <label className='mb-2'>
                                        <span className='fw-bold'>Password</span>
                                        <AiFillStar className='required' />
                                    </label>
                                    <div className='d-flex align-items-center'>
                                        <input
                                            type="text"
                                            name="password"
                                            placeholder='enter password'
                                            value={formData.password}
                                            onChange={handelInputChange}
                                            style={formData?.errors?.password ? { border: "1px solid red" } : null}
                                            className={`form-control`}
                                        />
                                        {
                                            showPassword ?
                                                <BiShow
                                                    size="25"
                                                    className={styles.passwordBtn}
                                                    onClick={() => showPasswordBtn()}
                                                /> :
                                                <BiHide
                                                    size="25"
                                                    className={styles.passwordBtn}
                                                    onClick={() => showPasswordBtn()}
                                                />
                                        }
                                    </div>
                                    <small className='validation-error'>
                                        {
                                            formData.errors?.password ? formData.errors?.password : null
                                        }
                                    </small>
                                </div>
                                <div className="form-group mb-3">
                                    <label className='mb-2'>
                                        <span className='fw-bold'>confirm Password</span>
                                        <AiFillStar className='required' />
                                    </label>
                                    <div className='d-flex align-items-center'>
                                        <input
                                            type="text"
                                            name="confirmPassword"
                                            placeholder='confirm password'
                                            value={formData.confirmPassword}
                                            onChange={handelInputChange}
                                            style={formData?.errors?.password ? { border: "1px solid red" } : null}
                                            className={`form-control`}
                                        />
                                        {
                                            showConfirmPassword ?
                                                <BiShow
                                                    size="25"
                                                    className={styles.passwordBtn}
                                                    onClick={() => showConfirmPasswordBtn()}
                                                /> :
                                                <BiHide
                                                    size="25"
                                                    className={styles.passwordBtn}
                                                    onClick={() => showConfirmPasswordBtn()}
                                                />
                                        }
                                    </div>
                                    <small className='validation-error'>
                                        {
                                            formData.errors?.confirmPassword ? formData.errors?.confirmPassword : null
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

export default AssistantSignup;
