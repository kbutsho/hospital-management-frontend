import React, { useState } from 'react';
import styles from '@/styles/signup/signup.module.css';
import { AiFillStar } from "react-icons/ai";
import { BiHide, BiShow } from "react-icons/bi";
import Link from 'next/link';
import Tabs from './Tabs';
import axios from 'axios';
import { ROLE } from '@/constant';
import { config } from '@/config';
import { toast } from 'react-toastify';

const AdministratorSignup = ({ activeComponent, handleTabClick }) => {
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        organization: '',
        designation: '',
        password: '',
        confirmPassword: '',
        errors: []
    })
    const handelInputChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        })
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
                organization: formData.organization,
                designation: formData.designation,
                role: ROLE.ADMINISTRATOR,
                password: formData.password,
                confirmPassword: formData.confirmPassword,
            }
            const response = await axios.post(`${config.api}/signup/administrator`, data
            );
            console.log(response)
        } catch (error) {
            setLoading(false);
            setFormData({
                ...formData,
                errors: error.response.data.error
            });
            toast.error(error.response.data.message)
        }
        // try {
        //     setLoading(!loading);
        //     const data = {
        //         firstName: formData.firstName,
        //         lastName: formData.lastName,
        //         email: formData.email,
        //         phone: formData.phone,
        //         password: formData.password,
        //         confirmPassword: formData.confirmPassword,
        //         role: role
        //     }
        //     const response = await axios.post(`${config.api}/auth/signup`, data
        //     );
        //     if (response.data.data) {
        //         setLoading(false);
        //         setFormData({
        //             firstName: '',
        //             lastName: '',
        //             phone: '',
        //             email: '',
        //             password: '',
        //             confirmPassword: '',
        //             errors: []
        //         });
        //         toast.info("check your email spam folder!")
        //         setVerifiedMessage(response.data.message)
        //     }
        //     else {
        //         setLoading(false);
        //         setVerifiedMessage(null)
        //         toast.error('something went wrong!')
        //     }

        // } catch (error) {
        //     setLoading(false);
        //     setVerifiedMessage(null);
        //     const errorMessages = error.response.data.errorMessages;
        //     const formattedErrors = {};
        //     errorMessages.forEach(err => {
        //         formattedErrors[err.path] = err.message;
        //     });
        //     setFormData(prevData => ({
        //         ...prevData,
        //         errors: formattedErrors
        //     }));
        //     toast.error(error.response.data.message)
        // }
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
                    <h4 className={styles.heading}> administrator signup</h4>
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
                                        placeholder='enter name'
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
                                        placeholder='enter phone'
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
                                        placeholder='enter email'
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
                                        placeholder='enter address'
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
                                        <span className='fw-bold'>Organization</span>
                                        <AiFillStar className='required' />
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder='your organization'
                                        onChange={handelInputChange}
                                        className={`form-control ${formData.errors?.organization ? 'is-invalid' : null}`}
                                    />
                                    <small className='validation-error'>
                                        {
                                            formData.errors?.organization ? formData.errors?.organization : null
                                        }
                                    </small>
                                </div>
                                <div className="form-group mb-3">
                                    <label className='mb-2'>
                                        <span className='fw-bold'>Designation</span>
                                        <AiFillStar className='required' />
                                    </label>
                                    <input
                                        type="text"
                                        name="designation"
                                        placeholder='your designation'
                                        onChange={handelInputChange}
                                        className={`form-control ${formData.errors?.designation ? 'is-invalid' : null}`}
                                    />
                                    <small className='validation-error'>
                                        {
                                            formData.errors?.designation ? formData.errors?.designation : null
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
                                            name="name"
                                            placeholder='confirm password'
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
                            <input type="submit" className='btn btn-primary  w-100 fw-bold' value="Submit" />
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
        </div >
    );
};

export default AdministratorSignup;
