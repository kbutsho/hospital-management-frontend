import React, { useState } from 'react';
import { AiFillStar } from 'react-icons/ai';
import Link from 'next/link';
import styles from '@/styles/login/login.module.css';
import { useRouter } from 'next/router';
import { BiHide, BiShow } from 'react-icons/bi';
import axios from 'axios';
import { config } from "@/config";
import { toast } from 'react-toastify';
import { BeatLoader } from 'react-spinners';
import Cookies from 'js-cookie';
import { ROLE } from '@/constant';
import { ImCross } from "react-icons/im"
import { errorHandler } from '@/helpers/errorHandler';

const Login = () => {
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState(null);
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        credential: '',
        password: '',
        errors: []
    })
    const showPasswordBtn = () => {
        setShowPassword(!showPassword);
    }
    const handelInputChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
            errors: {
                ...formData.errors,
                [event.target.name]: null
            }
        })
        setErrorMessage(null)
    };
    const formSubmit = async (event) => {
        event.preventDefault();
        try {
            setLoading(!loading);
            const data = {
                credential: formData?.credential,
                password: formData?.password,
            }
            const response = await axios.post(`${config.api}/login`, data)
            setErrorMessage(null)
            setLoading(false);
            if (response.data.status) {
                setFormData({
                    credential: '',
                    password: '',
                    errors: []
                });
                Cookies.set('token', response.data.token, { expires: 7 });
                Cookies.set('role', response.data.role, { expires: 7 });
                Cookies.set('name', response.data.name, { expires: 7 });
                if (response.data.role === ROLE.ADMINISTRATOR) {
                    toast.success(response.data.message);
                    router.push('/administrator/dashboard')
                }
                else if (response.data.role === ROLE.DOCTOR) {
                    toast.success(response.data.message);
                    router.push('/doctor/dashboard')
                }
                else if (response.data.role === ROLE.ASSISTANT) {
                    toast.success(response.data.message);
                    router.push('/assistant/dashboard')
                }
                else {
                    toast.error("invalid credential!");
                }
            }
        }
        catch (error) {
            console.log(error)
            setLoading(false);
            return errorHandler({ error, toast, setFormData, formData, setErrorMessage })
        }
    }
    const handelCrossBtn = () => {
        setErrorMessage(null)
    }
    const demoUser = {
        administrator: {
            credential: process.env.NEXT_PUBLIC_ADMINISTRATOR_EMAIL,
            password: process.env.NEXT_PUBLIC_ADMINISTRATOR_PASSWORD
        },
        doctor: {
            credential: process.env.NEXT_PUBLIC_DOCTOR_EMAIL,
            password: process.env.NEXT_PUBLIC_DOCTOR_PASSWORD
        },
        assistant: {
            credential: process.env.NEXT_PUBLIC_ASSISTANT_EMAIL,
            password: process.env.NEXT_PUBLIC_ASSISTANT_PASSWORD
        }
    }
    const handleUserClick = (user) => {
        setFormData({
            credential: user.credential,
            password: user.password
        });
    };
    return (
        <div className={styles.body}>
            <div className={styles.main}>
                <div className={styles.box}>
                    <h4 className={styles.heading}>Login</h4>
                    {
                        errorMessage ?
                            <div className='alert alert-danger fw-bold d-flex justify-content-between'>
                                <div>{errorMessage}</div>
                                <ImCross onClick={handelCrossBtn} className={styles.crossBtn} />
                            </div> : null
                    }
                    <form onSubmit={formSubmit}>
                        <div className="form-group mb-3">
                            <label htmlFor="credential" className='mb-2'>
                                <span className='fw-bold'>email or phone</span>
                                <AiFillStar className='required' />
                            </label>
                            <input
                                type="text"
                                id="credential"
                                name="credential"
                                placeholder='email or phone'
                                value={formData?.credential}
                                onChange={handelInputChange}
                                className={`form-control ${formData?.errors?.credential ? 'is-invalid' : null}`}
                            />
                            <small className='validation-error'>
                                {
                                    formData?.errors?.credential ? formData?.errors?.credential : null
                                }
                            </small>
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="password" className='mb-2'>
                                <span className='fw-bold'>password</span>
                                <AiFillStar className='required' />
                            </label>
                            <div className='d-flex align-items-center'>
                                <input
                                    id="password"
                                    name="password"
                                    placeholder='enter password'
                                    className='form-control'
                                    value={formData?.password}
                                    onChange={handelInputChange}
                                    type={showPassword ? "text" : "password"}
                                    style={formData?.errors?.password ? { border: "1px solid red" } : null}
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
                                    formData?.errors?.password ? formData?.errors?.password : null
                                }
                            </small>
                        </div>
                        <div className="form-group mt-4 mb-3">
                            <button type="submit" className='btn btn-primary w-100 fw-bold'>
                                {
                                    loading ?
                                        <BeatLoader color={'#fff'} loading={true} size={10} />
                                        : <span>submit</span>
                                }
                            </button>
                        </div>
                    </form>
                    {
                        process.env.NEXT_PUBLIC_IS_LOGIN === "true" ?
                            <div>
                                <table className={`${styles.demoUser} table table-bordered`}>
                                    <tbody>
                                        <tr>
                                            <td onClick={() => handleUserClick(demoUser.administrator)}>administrator</td>
                                            <td onClick={() => handleUserClick(demoUser.doctor)}>doctor</td>
                                            <td onClick={() => handleUserClick(demoUser.assistant)}>assistant</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div> : null
                    }
                    <div className='d-flex justify-content-between'>
                        <div>
                            <span className='small'><Link href="/home" className='link'>Home</Link></span>
                        </div>

                        <div>
                            <span className='small'>
                                <span>new user? </span>
                                <Link href="/signup" className='link'>signup here</Link>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
