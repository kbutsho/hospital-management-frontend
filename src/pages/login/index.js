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

const Login = () => {
    const router = useRouter();
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
    };
    const formSubmit = async (event) => {
        event.preventDefault();
        try {
            setLoading(!loading);
            const data = {
                credential: formData.credential,
                password: formData.password,
            }
            const response = await axios.post(`${config.api}/login`, data)
            setLoading(false);
            if (response.data.status) {
                setFormData({
                    credential: '',
                    password: '',
                    errors: []
                });
                Cookies.set('token', response.data.token, { expires: 7 });
                Cookies.set('userRole', response.data.userRole, { expires: 7 });
                if (response.data.userRole === ROLE.ADMINISTRATOR) {
                    toast.success(response.data.message);
                    router.push('/administrator/dashboard')
                }
                else if (response.data.userRole === ROLE.DOCTOR) {
                    toast.success(response.data.message);
                    router.push('/doctor/dashboard')
                }
                else if (response.data.userRole === ROLE.ASSISTANT) {
                    toast.success(response.data.message);
                    router.push('/assistant/dashboard')
                }
                else {
                    toast.error("invalid credential!");
                }
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
                    <h4 className={styles.heading}>Login</h4>
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
                                value={formData.credential}
                                onChange={handelInputChange}
                                className={`form-control ${formData.errors?.credential ? 'is-invalid' : null}`}
                            />
                            <small className='validation-error'>
                                {
                                    formData.errors?.credential ? formData.errors?.credential : null
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
                                    value={formData.password}
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
                                    formData.errors?.password ? formData.errors?.password : null
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
