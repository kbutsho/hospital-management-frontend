import { useEffect, useState } from 'react';
import styles from '@/styles/signup/signup.module.css';
import { AiFillStar } from "react-icons/ai";
import { BiHide, BiShow } from "react-icons/bi";
import Link from 'next/link';
import Tabs from './Tabs';
import { ROLE, STATUS } from '@/constant';
import { toast } from 'react-toastify';
import axios from 'axios';
import { config } from '@/config';
import { BeatLoader } from 'react-spinners';
import { ImCross } from "react-icons/im"
import Select from 'react-select';
import { errorHandler } from '@/helpers/errorHandler';

const DoctorSignup = ({ activeComponent, handleTabClick }) => {
    const [message, setMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [department, setDepartment] = useState(null);

    useEffect(() => {
        const fetchDepartment = async () => {
            try {
                const response = await axios.get(`${config.api}/signup/doctor/departmentList`);
                setDepartment(response.data.data)
                setErrorMessage(null)
            } catch (error) {
                setMessage(null)
                return errorHandler({ error, toast })
            }
        }
        fetchDepartment()
    }, [])
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        bmdc_id: '',
        designation: '',
        password: '',
        confirmPassword: '',
        errors: []
    })
    const [selectDepartment, setSelectDepartment] = useState(null);
    const handelInputChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
            errors: {
                ...formData.errors,
                [event.target.name]: null
            }
        });
        setMessage(null)
        setErrorMessage(null)
    };
    const options = department?.map((dept) => ({ value: dept.id, label: dept.name }));
    const handleDepartmentChange = (newValue) => {
        setSelectDepartment(newValue);
        setFormData({
            ...formData,
            errors: {
                ...formData.errors,
                department_id: null
            }
        });
        setMessage(null)
        setErrorMessage(null)
    };
    const customStyles = {
        // control: (provided) => ({
        //     ...provided
        // }),
        option: (provided) => ({
            ...provided,
            cursor: 'pointer'
        }),
    };
    const formSubmit = async (event) => {
        event.preventDefault();
        try {
            setLoading(!loading);
            const data = {
                name: formData.name,
                phone: formData.phone,
                email: formData.email,
                bmdc_id: formData.bmdc_id,
                department_id: selectDepartment?.value,
                designation: formData.designation,
                role: ROLE.DOCTOR,
                password: formData.password,
                confirmPassword: formData.confirmPassword,
            }
            const response = await axios.post(`${config.api}/signup/doctor`, data);
            if (response.data.status) {
                setLoading(false);
                setFormData({
                    name: '',
                    phone: '',
                    email: '',
                    bmdc_id: '',
                    designation: '',
                    password: '',
                    confirmPassword: '',
                    errors: []
                });
                setSelectDepartment(null);
                setMessage(response.data.message)
                setErrorMessage(null)
            }
        } catch (error) {
            setLoading(false);
            setMessage(null)
            return errorHandler({ error, toast, setFormData, formData, setErrorMessage })
        }
    }
    const showPasswordBtn = () => {
        setShowPassword(!showPassword)
    }
    const showConfirmPasswordBtn = () => {
        setShowConfirmPassword(!showConfirmPassword)
    }
    const handelCrossBtn = () => {
        setMessage(null)
        setErrorMessage(null)
    }
    return (
        <div className={styles.body}>
            <div className={styles.main}>
                <div className={styles.box}>
                    <Tabs activeComponent={activeComponent} handleTabClick={handleTabClick} />
                    <h4 className={styles.heading}>doctor signup</h4>
                    {
                        message ?
                            <div className='alert alert-success fw-bold d-flex justify-content-between'>
                                <div>{message}</div>
                                <ImCross onClick={handelCrossBtn} className={styles.crossBtn} />
                            </div> : null
                    }
                    {
                        errorMessage ?
                            <div className='alert alert-danger fw-bold d-flex justify-content-between'>
                                <div>{errorMessage}</div>
                                <ImCross onClick={handelCrossBtn} className={styles.crossBtn} />
                            </div> : null
                    }
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
                                        <span className='fw-bold'>BMDC Id</span>
                                        <AiFillStar className='required' />
                                    </label>
                                    <input
                                        type="text"
                                        name="bmdc_id"
                                        placeholder='your bmdc is'
                                        value={formData.bmdc_id}
                                        onChange={handelInputChange}
                                        className={`form-control ${formData.errors?.bmdc_id ? 'is-invalid' : null}`}
                                    />
                                    <small className='validation-error'>
                                        {
                                            formData.errors?.bmdc_id ? formData.errors?.bmdc_id : null
                                        }
                                    </small>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group mb-3">
                                    <label className='mb-2'>
                                        <span className='fw-bold'>Department</span>
                                        <AiFillStar className='required' />
                                    </label>
                                    <div>
                                        <Select
                                            value={selectDepartment}
                                            onChange={handleDepartmentChange}
                                            options={options}
                                            isSearchable
                                            placeholder="search or select department"
                                            styles={customStyles}
                                        />
                                    </div>
                                    <small className='validation-error'>
                                        {
                                            formData.errors?.department_id ? formData.errors?.department_id : null
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
                                        value={formData.designation}
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

export default DoctorSignup;


