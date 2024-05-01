import Breadcrumb from '@/components/breadcrumb';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import styles from "@/styles/administrator/List.module.css"
import { SyncLoader } from 'react-spinners';
import axios from 'axios';
import Cookies from 'js-cookie';
import { config } from '@/config';
import { errorHandler } from '@/helpers/errorHandler';
import { toast } from 'react-toastify';
import { AiFillStar } from 'react-icons/ai';
import Image from 'next/image';
import demoUser from '../../../assets/user.png'
import { MdDelete, MdModeEdit } from 'react-icons/md';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import { ImCross } from 'react-icons/im';
import AssistantLayout from '@/layouts/assistant/AssistantLayout';

const AssistantProfile = () => {
    const token = Cookies.get('token');
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        email: '',
        phone: '',
        age: '',
        gender: '',
        old_password: '',
        new_password: '',
        confirm_password: '',
        photo: null,
        errors: []
    })

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${config.api}/assistant/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setLoading(false)
            setData(res.data.data)
            setFormData(res.data.data)
            console.log(res)
        } catch (error) {
            setLoading(false)
            console.log(error)
            return errorHandler({ error, toast })
        }
    }
    useEffect(() => {
        fetchData()
    }, [])

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

    const formSubmit = async () => {
        try {
            setLoading(true)
            const data = {
                'name': formData.name.toUpperCase(),
                'email': formData.email,
                'phone': formData.phone,
                'address': formData.address,
                'age': formData.age,
                'gender': formData.gender
            }
            const res = await axios.post(`${config.api}/assistant/profile/update`, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setLoading(false)
            fetchData();
            if (res.data.data.name !== Cookies.get('name')) {
                Cookies.set('name', res.data.data.name, { expires: 7 });
            }
            toast.success(res.data.message)

        } catch (error) {
            setLoading(false)
            console.log(error.response)
            if (error.response.data.error) {
                // setFormData(prevState => ({
                //     ...prevState,
                //     errors: error.response.data.error
                // }));
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
            setAddLoading(true)
            const res = await axios.post(`${config.api}/assistant/profile/photo/update`, formDataToSend, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setAddLoading(false)
            fetchData();
            togglePhotoAddModal()
            Cookies.set('profile_photo', res.data.data.photo, { expires: 7 });
            toast.success(res.data.message)
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
            setAddLoading(true);
            const res = await axios.get(`${config.api}/assistant/profile/photo/delete`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            fetchData()
            console.log(res)
            setAddLoading(false)
            Cookies.remove('profile_photo')
            toast.success(res.data.message)
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
            setAddLoading(true)
            const data = {
                'old_password': formData.old_password,
                'new_password': formData.new_password,
                'confirm_password': formData.confirm_password
            }
            const res = await axios.post(`${config.api}/assistant/profile/change-password`, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setAddLoading(false)
            toast.success(res.data.message)
            setChangePasswordModal(!changePasswordModal)
        } catch (error) {
            console.log(error)
            setAddLoading(false);
            return errorHandler({ error, toast, setFormData, formData })
        }
    }
    return (
        <div>
            <Head>
                <title>profile</title>
            </Head>
            <Breadcrumb />
            <div className={`row py-3 px-2 ${styles.listArea}`}>
                {
                    loading ? (
                        <div className={styles.loadingArea}>
                            <SyncLoader color='#36D7B7' size="12" />
                        </div>
                    ) : (
                        data ?
                            <div>
                                <div className='row'>
                                    {/* <pre>{JSON.stringify(formData, null, 2)}</pre> */}
                                    <div className="col-md-6">
                                        <div className='d-flex align-items-end'>
                                            {
                                                data.photo ?
                                                    <Image src={`${config.backend_api}/uploads/assistantProfile/${data.photo}`} height={186} width={186} alt="profile" /> :
                                                    <Image src={demoUser} height={186} width={186} alt="profile" />
                                            }
                                            <button
                                                style={{ borderRadius: "2px" }}
                                                onClick={togglePhotoAddModal}
                                                className='ms-3 me-2 btn btn-primary btn-sm'>
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

                                        </div>

                                        <div className='my-3'>
                                            <label className='fw-bold my-2'>
                                                <span>Name</span>
                                                <AiFillStar className='required' />
                                            </label>
                                            <input
                                                style={{ borderRadius: "2px" }}
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
                                                style={{ borderRadius: "2px" }}
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

                                    </div>
                                    <div className="col-md-6">
                                        <div className='my-3'>
                                            <label className='fw-bold my-2'>
                                                <span>Email</span>
                                                <AiFillStar className='required' />
                                            </label>
                                            <input
                                                style={{ borderRadius: "2px" }}
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
                                                style={{ borderRadius: "2px" }}
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
                                                style={{ borderRadius: "2px" }}
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
                                                style={{ borderRadius: "2px" }}
                                                name="gender"
                                                onChange={handelInputChange}
                                                value={formData.gender}
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
                                </div>
                                <div className='d-flex justify-content-end'>
                                    <button
                                        style={{ borderRadius: "2px" }}
                                        onClick={toggleChangePasswordModal}
                                        className='btn btn-success btn-sm me-2 fw-bold'>
                                        change password
                                    </button>
                                    <button
                                        style={{ borderRadius: "2px" }}
                                        className='btn btn-primary px-4 fw-bold'
                                        onClick={formSubmit}>
                                        update
                                    </button>
                                </div>
                            </div> :
                            <div className={styles.notFound}>
                                <h6 className='fw-bold text-uppercase'>something went wrong</h6>
                            </div>
                    )
                }
                {
                    photoAddModal ? (
                        <div>
                            <Modal isOpen={photoAddModal} className="modal-md">
                                <ModalBody>
                                    <div className='p-3'>
                                        <div className='d-flex justify-content-between'>
                                            <h4 className='text-uppercase fw-bold mb-4'>profile photo</h4>
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
                                                <input
                                                    type="file"
                                                    name="photo"
                                                    className='form-control'
                                                    style={{ borderRadius: "2px" }}
                                                    onChange={handlePhotoChange} />
                                            </div>
                                            <small className='validation-error'>
                                                {
                                                    formData.errors?.photo ? formData.errors?.photo : null
                                                }
                                            </small>
                                            {
                                                addLoading ?
                                                    <button
                                                        disabled
                                                        style={{ borderRadius: "2px" }}
                                                        className='mt-4 fw-bold w-100 btn btn-primary'>
                                                        submitting...
                                                    </button> :
                                                    <input
                                                        type="submit"
                                                        value="submit"
                                                        style={{ borderRadius: "2px" }}
                                                        className='mt-4 fw-bold w-100 btn btn-primary' />
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
                                        <button
                                            style={{ borderRadius: "2px" }}
                                            onClick={togglePhotoDeleteModal}
                                            className='btn btn-primary btn-sm fw-bold me-2'>
                                            close
                                        </button>
                                        <button
                                            style={{ borderRadius: "2px" }}
                                            onClick={handelDeletePhoto}
                                            className='btn btn-danger btn-sm fw-bold'>
                                            delete
                                        </button>
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
                                                <span className='fw-bold'>old password</span>
                                                <AiFillStar className='required' />
                                            </label>
                                            <input
                                                type="password"
                                                name="old_password"
                                                className={`form-control ${formData?.errors?.old_password ? 'is-invalid' : null}`}
                                                placeholder='enter your old password'
                                                onChange={handlePasswordUpdateChange} />
                                            <small className='validation-error'>
                                                {
                                                    formData.errors?.old_password ? formData.errors?.old_password : null
                                                }
                                            </small>
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
                                                placeholder='enter your new password'
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
                                                placeholder='enter your confirm password'
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

export default AssistantProfile;
AssistantProfile.getLayout = function getLayout(page) {
    return <AssistantLayout>{page}</AssistantLayout>;
};