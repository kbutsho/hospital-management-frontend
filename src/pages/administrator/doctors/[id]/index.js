import Breadcrumb from "@/components/breadcrumb";
import { errorHandler } from "@/helpers/errorHandler";
import AdministratorLayout from "@/layouts/administrator/AdministratorLayout";
import styles from "@/styles/administrator/List.module.css"
import axios from "axios";
import Cookies from "js-cookie";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ImCross } from "react-icons/im";
import { toast } from "react-toastify";
import { config } from "@/config";
import { FadeLoader } from "react-spinners";
import Image from "next/image";
import demoUser from '../../../../assets/user.png'
import { MdDelete, MdModeEdit } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { AiFillStar } from "react-icons/ai";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';

const DoctorDetails = () => {
    const router = useRouter();
    const { id } = router.query
    const token = Cookies.get('token');

    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null);
    const [data, setData] = useState(null)
    const [bioData, setBioData] = useState('')

    const [formData, setFormData] = useState({
        name: '',
        address: '',
        email: '',
        phone: '',
        age: '',
        gender: '',
        bmdc_id: '',
        department_id: '',
        bio: '',
        designation: '',
        // old_password: '',
        new_password: '',
        confirm_password: '',
        photo: null,
        errors: []
    })

    const [department, setDepartment] = useState(null)
    const fetchDepartment = async () => {
        try {
            const res = await axios.get(`${config.api}/department/all`)
            setDepartment(res.data.data)
        } catch (error) {
            console.log(error)
            return errorHandler({ error, toast })
        }
    }

    const fetchData = async (id) => {
        try {
            if (id) {
                setErrorMessage(null)
                setLoading(true)
                const res = await axios.get(`${config.api}/administrator/doctor/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                setLoading(false)
                setData(res.data.data)
                setFormData(res.data.data)
                const startIndex = res.data.data.bio.indexOf('{"bioData":"') + '{"bioData":"'.length;
                const endIndex = res.data.data.bio.lastIndexOf('"}');
                const extractedContent = res.data.data.bio.substring(startIndex, endIndex);
                setBioData(extractedContent)
            }
        } catch (error) {
            setLoading(false)
            errorHandler({ error, toast, setErrorMessage })
        }
    }
    useEffect(() => {
        fetchDepartment()
        fetchData(id)
    }, [id])

    const handelErrorMessage = () => {
        setErrorMessage(null)
    }

    // update profile
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

    // handel bio data
    const handelBioChange = (value) => {
        setBioData(value)
    }
    const formSubmit = async (id) => {
        try {
            if (id) {
                setLoading(true)
                const data = {
                    'name': formData.name.toUpperCase(),
                    'email': formData.email,
                    'phone': formData.phone,
                    'address': formData.address,
                    'age': formData.age,
                    'gender': formData.gender,
                    'bmdc_id': formData.bmdc_id,
                    'department_id': formData.department_id,
                    'bio': JSON.stringify({ bioData }),
                    'designation': formData.designation,
                }
                const res = await axios.post(`${config.api}/administrator/doctor/profile/update/${id}`, data, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setLoading(false)
                fetchData(id);
                toast.success(res.data.message)
            }

        } catch (error) {
            setLoading(false)
            console.log(error.response)
            if (error.response.data.error) {
                setFormData({
                    ...data,
                    errors: error.response.data.error
                });
            }
            return errorHandler({ error, toast })
        }
    }






    // update photo
    const [photoAddModal, setPhotoAddModal] = useState(false)
    const [addLoading, setAddLoading] = useState(false)
    const togglePhotoAddModal = () => {
        setPhotoAddModal(!photoAddModal);
    }
    const handlePhotoChange = (e) => {
        const { name, value, files } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: name === 'photo' ? files[0] : value
        }));
    };

    const handlePhotoSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        formDataToSend.append('photo', formData.photo);
        try {
            if (id) {
                setAddLoading(true)
                const res = await axios.post(`${config.api}/administrator/doctor/profile/photo/update/${id}`, formDataToSend, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                setAddLoading(false)
                fetchData(id);
                togglePhotoAddModal()
                toast.success(res.data.message)
            }
        } catch (error) {
            setAddLoading(false)
            console.log(error)
            if (error.response.data.error) {
                setFormData(prevState => ({
                    ...prevState,
                    errors: error.response.data.error
                }));
            }
            return errorHandler({ error, toast })
        }
    };

    // delete photo
    const [photoDeleteModal, setPhotoDeleteModal] = useState(false)
    const togglePhotoDeleteModal = () => {
        setPhotoDeleteModal(!photoDeleteModal);
    }
    const handelDeletePhoto = async () => {
        try {
            if (id) {
                setAddLoading(true);
                const res = await axios.get(`${config.api}/administrator/doctor/profile/photo/delete/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                fetchData(id)
                console.log(res)
                setAddLoading(false)
                toast.success(res.data.message)
            }
        } catch (error) {
            console.log(error)
            setAddLoading(false)
            return errorHandler({ error, toast })
        }
    }


    // change password
    const [changePasswordModal, setChangePasswordModal] = useState(false)
    const toggleChangePasswordModal = () => {
        setChangePasswordModal(!changePasswordModal)
        setAddLoading(false)
        setFormData(prevState => ({
            ...prevState,
            errors: []
        }));
    }
    const handlePasswordUpdateChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
            errors: {
                ...formData.errors,
                [event.target.name]: null
            }
        });
    }
    const submitPasswordChange = async () => {
        try {
            if (id) {
                setAddLoading(true)
                const data = {
                    'new_password': formData.new_password,
                    'confirm_password': formData.confirm_password
                }
                const res = await axios.post(`${config.api}/administrator/doctor/profile/change-password/${id}`, data, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                setAddLoading(false)
                toast.success(res.data.message)
                setChangePasswordModal(!changePasswordModal)
            }
        } catch (error) {
            console.log(error)
            setAddLoading(false);
            return errorHandler({ error, toast, setFormData, formData })
        }
    }







    return (
        <div>
            <Head>
                <title>doctor details</title>
            </Head>
            {
                data ? <Breadcrumb name={data?.name} /> : <span className="fw-bold"></span>
            }
            <div className={`py-3 px-2 ${styles.listArea}`}>
                {
                    loading ? null : (
                        errorMessage ? (
                            <div className="alert alert-danger fw-bold">
                                <div className='d-flex justify-content-between'>
                                    {errorMessage}
                                    <ImCross size="18px"
                                        className='pt-1'
                                        style={{ cursor: "pointer" }}
                                        onClick={handelErrorMessage} />
                                </div>
                            </div>
                        ) : null
                    )
                }
                {
                    loading ? (
                        <div className={styles.loadingArea} style={{ minHeight: "70vh", marginTop: "0px" }}>
                            <FadeLoader color='#d3d3d3' size="16" />
                        </div>
                    ) : (
                        data ?
                            <div>
                                {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
                                <div className='row'>
                                    <div className="col-md-6">
                                        <div className='d-flex align-items-end'>
                                            {
                                                data.photo ?
                                                    <Image src={`${config.backend_api}/uploads/doctorProfile/${data.photo}`} height={186} width={186} alt="profile" /> :
                                                    <Image src={demoUser} height={186} width={186} alt="profile" />
                                            }
                                            <div>
                                                <button
                                                    style={{ borderRadius: "2px" }}
                                                    onClick={togglePhotoAddModal}
                                                    className='mx-2 btn btn-primary btn-sm'>
                                                    <MdModeEdit />
                                                </button>
                                                {
                                                    data.photo ?
                                                        <button
                                                            style={{ borderRadius: "2px" }}
                                                            onClick={togglePhotoDeleteModal}
                                                            className='btn btn-danger btn-sm'>
                                                            <MdDelete />
                                                        </button> : null
                                                }
                                                <button
                                                    style={{ borderRadius: "2px" }}
                                                    onClick={toggleChangePasswordModal}
                                                    className='ms-2 btn btn-success btn-sm'>
                                                    <RiLockPasswordLine />
                                                </button>
                                            </div>

                                        </div>
                                        <div className='my-3'>
                                            <label className='fw-bold my-2'>
                                                <span>Name</span>
                                                <AiFillStar className='required' />
                                            </label>
                                            <input
                                                name="name"
                                                onChange={handelInputChange}
                                                defaultValue={data?.name}
                                                type="text"
                                                placeholder='your name'
                                                className='form-control' />
                                            <small className='validation-error'>
                                                {
                                                    formData?.errors?.name ? formData?.errors?.name : null
                                                }
                                            </small>
                                        </div>
                                        <div className='my-3'>
                                            <label className='fw-bold my-2'>
                                                <span>Phone</span>
                                                <AiFillStar className='required' />
                                            </label>
                                            <input
                                                name="phone"
                                                onChange={handelInputChange}
                                                defaultValue={data?.phone}
                                                type="text"
                                                placeholder='your phone'
                                                className='form-control' />
                                            <small className='validation-error'>
                                                {
                                                    formData?.errors?.phone ? formData?.errors?.phone : null
                                                }
                                            </small>
                                        </div>
                                        <div className='my-3'>
                                            <label className='fw-bold my-2'>
                                                <span>Department</span>
                                                <AiFillStar className='required' />
                                            </label>
                                            <select
                                                name="department_id"
                                                onChange={handelInputChange}
                                                value={formData.department_id || ''}
                                                className='form-select'
                                            >
                                                <option value="">Select Department</option>
                                                {department &&
                                                    department.map(dep => (
                                                        <option key={dep.id} value={dep.id}>{dep.name}</option>
                                                    ))
                                                }
                                            </select>
                                            <small className='validation-error'>
                                                {formData?.errors?.department_id ? formData?.errors?.department_id : null}
                                            </small>
                                        </div>

                                    </div>
                                    <div className="col-md-6">
                                        <div className='my-3'>
                                            <label className='fw-bold my-2'>
                                                <span>Designation</span>
                                                <AiFillStar className='required' />
                                            </label>
                                            <input
                                                name="designation"
                                                onChange={handelInputChange}
                                                defaultValue={data?.designation}
                                                type="text"
                                                placeholder='your phone'
                                                className='form-control' />
                                            <small className='validation-error'>
                                                {
                                                    formData?.errors?.designation ? formData?.errors?.designation : null
                                                }
                                            </small>
                                        </div>
                                        <div className='my-3'>
                                            <label className='fw-bold my-2'>
                                                <span>Email</span>
                                                <AiFillStar className='required' />
                                            </label>
                                            <input
                                                name="email"
                                                onChange={handelInputChange}
                                                defaultValue={data?.email}
                                                type="text"
                                                placeholder='your email'
                                                className='form-control' />
                                            <small className='validation-error'>
                                                {
                                                    formData?.errors?.email ? formData?.errors?.email : null
                                                }
                                            </small>
                                        </div>
                                        <div className='my-3'>
                                            <label className='fw-bold my-2'>
                                                <span>Address</span>
                                                <AiFillStar className='required' />
                                            </label>
                                            <input
                                                name="address"
                                                onChange={handelInputChange}
                                                defaultValue={data?.address}
                                                type="text"
                                                placeholder='your address'
                                                className='form-control' />
                                            <small className='validation-error'>
                                                {
                                                    formData?.errors?.address ? formData?.errors?.address : null
                                                }
                                            </small>
                                        </div>
                                        <div className='my-3'>
                                            <label className='fw-bold my-2'>
                                                <span>Age</span>
                                                <AiFillStar className='required' />
                                            </label>
                                            <input
                                                name="age"
                                                onChange={handelInputChange}
                                                defaultValue={data?.age}
                                                type="number"
                                                placeholder='your age'
                                                className='form-control' />
                                            <small className='validation-error'>
                                                {
                                                    formData?.errors?.age ? formData?.errors?.age : null
                                                }
                                            </small>
                                        </div>
                                        <div className='my-3'>
                                            <label className='fw-bold my-2'>
                                                <span>Gender</span>
                                                <AiFillStar className='required' />
                                            </label>
                                            <select
                                                name="gender"
                                                onChange={handelInputChange}
                                                value={formData.gender || ''}
                                                className='form-select'
                                            >
                                                <option value="">Select Gender</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                            </select>
                                            <small className='validation-error'>
                                                {formData?.errors?.gender ? formData?.errors?.gender : null}
                                            </small>
                                        </div>
                                    </div>
                                    <div className="col-md-12" style={{ height: "600px" }}>
                                        <div>
                                            <label className='fw-bold my-2'>
                                                <span>Bio Data</span>
                                                <AiFillStar className='required' />
                                            </label>
                                            {typeof window !== 'undefined' && (
                                                <ReactQuill
                                                    theme="snow"
                                                    value={bioData}
                                                    onChange={handelBioChange}
                                                    style={{ height: '510px' }}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className='d-flex justify-content-end my-3'>
                                    <button
                                        style={{ borderRadius: "2px" }}
                                        className='btn btn-primary w-100 fw-bold'
                                        onClick={() => formSubmit(id)}>
                                        update
                                    </button>
                                </div>
                            </div>
                            : null
                    )
                }
                {
                    photoAddModal ? (
                        <div>
                            <Modal isOpen={photoAddModal} className="modal-md">
                                <ModalBody>
                                    <div className='p-3'>
                                        <div className='d-flex justify-content-between'>
                                            <h4 className='text-uppercase fw-bold mb-4'>change profile photo</h4>
                                            <ImCross size="24px"
                                                className='pt-2'
                                                style={{ cursor: "pointer", color: "red" }}
                                                onClick={togglePhotoAddModal} />
                                        </div>
                                        <form onSubmit={handlePhotoSubmit} encType='multiple/form-data'>
                                            <div>
                                                <label className='mb-3'>
                                                    <span className='fw-bold'>upload photo</span>
                                                    <AiFillStar className='required' />
                                                </label>
                                                <input type="file" name="photo" className='form-control' onChange={handlePhotoChange} />
                                            </div>
                                            <small className='validation-error'>
                                                {
                                                    formData.errors?.photo ? formData.errors?.photo : null
                                                }
                                            </small>
                                            {
                                                addLoading ?
                                                    <button disabled className='mt-4 fw-bold w-100 btn btn-primary'>submitting...</button> :
                                                    <input type="submit" value="submit" className='mt-4 fw-bold w-100 btn btn-primary' />
                                            }
                                        </form>
                                    </div>
                                </ModalBody>
                            </Modal>
                        </div>
                    ) : null
                }
                {
                    photoDeleteModal ? (
                        <div>
                            <Modal isOpen={photoDeleteModal} className="modal-md" onClick={togglePhotoDeleteModal}>
                                <ModalBody>
                                    <div className='p-3'>
                                        <h6 className='fw-bold text-center text-danger'>are you sure want to delete your profile photo?</h6>
                                    </div>
                                </ModalBody>
                                <ModalFooter>
                                    <div className='d-flex'>
                                        <button onClick={togglePhotoDeleteModal} className='btn btn-primary btn-sm fw-bold me-2'>close</button>
                                        <button onClick={handelDeletePhoto} className='btn btn-danger btn-sm fw-bold'>delete</button>
                                    </div>
                                </ModalFooter>
                            </Modal>
                        </div>
                    ) : null
                }
                {
                    changePasswordModal ? (
                        <div>
                            <Modal isOpen={changePasswordModal} className="modal-md">
                                <ModalBody>
                                    <div className='p-3'>
                                        <div className='d-flex justify-content-between'>
                                            <h4 className='text-uppercase fw-bold mb-4'>change password</h4>
                                            <ImCross size="24px"
                                                className='pt-2'
                                                style={{ cursor: "pointer", color: "red" }}
                                                onClick={toggleChangePasswordModal} />
                                        </div>
                                        <div className='mb-3'>
                                            <label className='mb-2'>
                                                <span className='fw-bold'>new password</span>
                                                <AiFillStar className='required' />
                                            </label>
                                            <input
                                                type="password"
                                                name="new_password"
                                                className={`form-control ${formData?.errors?.new_password ? 'is-invalid' : null}`}
                                                placeholder='enter new password'
                                                onChange={handlePasswordUpdateChange} />
                                            <small className='validation-error'>
                                                {
                                                    formData.errors?.new_password ? formData.errors?.new_password : null
                                                }
                                            </small>
                                        </div>
                                        <div className='mb-3'>
                                            <label className='mb-2'>
                                                <span className='fw-bold'>confirm password</span>
                                                <AiFillStar className='required' />
                                            </label>
                                            <input
                                                type="password"
                                                name="confirm_password"
                                                placeholder='enter confirm password'
                                                className={`form-control ${formData?.errors?.confirm_password ? 'is-invalid' : null}`}
                                                onChange={handlePasswordUpdateChange} />
                                            <small className='validation-error'>
                                                {
                                                    formData.errors?.confirm_password ? formData.errors?.confirm_password : null
                                                }
                                            </small>
                                        </div>

                                        {
                                            addLoading ?
                                                <button disabled className='mt-4 fw-bold w-100 btn btn-primary'>submitting...</button> :
                                                <button onClick={submitPasswordChange} className='mt-4 fw-bold w-100 btn btn-primary'>submit</button>
                                        }
                                    </div>
                                </ModalBody>
                            </Modal>
                        </div>
                    ) : null
                }
            </div>
        </div>
    );
};

export default DoctorDetails;
DoctorDetails.getLayout = function getLayout(page) {
    return <AdministratorLayout>{page}</AdministratorLayout>;
};