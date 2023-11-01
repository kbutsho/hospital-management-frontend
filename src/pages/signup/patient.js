import React, { useState } from 'react';
import styles from '@/styles/signup/signup.module.css';
import { AiFillStar } from "react-icons/ai";
import { BiHide, BiShow } from "react-icons/bi";
import Link from 'next/link';
import { useRouter } from 'next/router';
import SignupNavigation from '@/layouts/signup/SignupNavigation';

const PatientSignup = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const router = useRouter();
    const currentURL = (router.asPath).split('/')[2];
    const showPasswordBtn = () => {
        setShowPassword(!showPassword);
    }
    const showConfirmPasswordBtn = () => {
        setShowConfirmPassword(!showConfirmPassword);
    }
    return (
        <div className={styles.body}>
            <div className={styles.main}>
                <div className={styles.box}>
                    <SignupNavigation />
                    <h4 className={styles.heading}> {currentURL} signup</h4>
                    <form>
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
                                        className='form-control'
                                    />
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
                                        className='form-control'
                                    />
                                </div>
                                <div className="form-group mb-3">
                                    <label className='mb-2'>
                                        <span className='fw-bold'>Age</span>
                                        <AiFillStar className='required' />
                                    </label>
                                    <input
                                        type="text"
                                        name="email"
                                        placeholder='enter email'
                                        className='form-control'
                                    />
                                </div>
                                <div className="form-group mb-3">
                                    <label className='mb-2'>
                                        <span className='fw-bold'>Gender</span>
                                        <AiFillStar className='required' />
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        placeholder='enter address'
                                        className='form-control'
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group mb-3">
                                    <label className='mb-2'>
                                        <span className='fw-bold'>Blood group</span>
                                        <AiFillStar className='required' />
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        placeholder='enter address'
                                        className='form-control'
                                    />
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
                                        className='form-control'
                                    />
                                </div>
                                <div className="form-group mb-3">
                                    <label className='mb-2'>
                                        <span className='fw-bold'>Emergency contact name</span>
                                        <AiFillStar className='required' />
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        placeholder='enter address'
                                        className='form-control'
                                    />
                                </div>
                                <div className="form-group mb-3">
                                    <label className='mb-2'>
                                        <span className='fw-bold'>Emergency contact number</span>
                                        <AiFillStar className='required' />
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        placeholder='enter address'
                                        className='form-control'
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="form-group my-2">
                            <input type="submit" className='btn btn-primary  w-100 fw-bold' value="Submit" />
                        </div>
                        <div className='d-flex justify-content-between'>
                            <div>
                                <span className='small'><Link href="/home" className='link'>Home</Link></span>
                            </div>
                            <div>
                                <span className='small'>
                                    <span>already have an account? </span>
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

export default PatientSignup;
