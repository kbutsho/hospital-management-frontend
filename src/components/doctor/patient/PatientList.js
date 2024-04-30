import React, { useEffect, useState } from 'react';
import styles from "@/styles/administrator/List.module.css"
import { config } from "@/config/index";
import Cookies from 'js-cookie';
import axios from 'axios';
import { toast } from 'react-toastify';
import { SyncLoader } from 'react-spinners';
import { AiFillDelete, AiFillEdit, AiFillEye, AiFillStar } from 'react-icons/ai';
import { Table } from 'react-bootstrap';
import Pagination from '@/helpers/pagination';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import { errorHandler } from '@/helpers/errorHandler';
import SortingArrow from '@/helpers/sorting/SortingArrow';
import { CiSearch } from "react-icons/ci";
import { MdOutlineRefresh } from "react-icons/md";
import { ImCross } from "react-icons/im";
import { useDispatch, useSelector } from 'react-redux';
import {
    storePatient,
    totalItemsCount,
    fetchedItemsCount,
    removePatient
} from '@/redux/slice/doctor/patientSlice';
import { useRouter } from 'next/router';


const PatientList = () => {
    const dispatch = useDispatch();
    const router = useRouter()
    const token = Cookies.get('token');
    const [loading, setLoading] = useState(false);
    const [found, setFound] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null);
    const [activeSortBy, setActiveSortBy] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [sortOrder, setSortOrder] = useState('desc')
    const [deleteModal, setDeleteModal] = useState(false)
    const [deleteItem, setDeleteItem] = useState({
        id: '',
        name: ''
    })

    // pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [dataPerPage, setDataPerPage] = useState(10);

    // load data
    const fetchData = async () => {
        try {
            const data = {
                perPage: dataPerPage,
                page: currentPage,
                searchTerm: searchTerm,
                sortOrder: sortOrder,
                sortBy: sortBy
            }
            const response = await axios.get(`${config.api}/doctor/patient/all`, {
                params: data,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setErrorMessage(null)
            dispatch(storePatient(response.data.data))
            dispatch(totalItemsCount(response.data.totalItems))
            dispatch(fetchedItemsCount(response.data.fetchedItems))
            setFound(true)
        } catch (error) {
            return errorHandler({ error, setErrorMessage })
        }
    };
    useEffect(() => {
        fetchData()
    }, [currentPage, dataPerPage, sortOrder, sortBy])

    const reduxStorePatient = useSelector(state => state.doctor_patients.data);
    const totalItems = useSelector(state => state.doctor_patients.totalItems);
    const fetchedItems = useSelector(state => state.doctor_patients.fetchedItems);

    // sort order
    const handleSortOrderChange = (order, sortField) => {
        setActiveSortBy(sortField)
        setSortBy(sortField);
        setSortOrder(order);
    };

    // search 
    const handelSearch = (event) => {
        setSearchTerm(event.target.value);
    };
    const handelSearchSubmit = async () => {
        try {
            await fetchData();
            setSearchTerm('')
        } catch (error) {
            setSearchTerm('')
            return errorHandler({ error, setErrorMessage })
        }
    }

    // delete
    const toggleDeleteModal = (id, name) => {
        setDeleteModal(!deleteModal)
        setDeleteItem({ name: name ?? '', id: id ?? '' });
    }
    const handelDelete = async () => {
        try {
            await axios.delete(`${config.api}/doctor/patient/${deleteItem?.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            dispatch(removePatient(deleteItem?.id));
            toast.success("patient deleted successfully!")
            setErrorMessage(null)
            await fetchData()
        } catch (error) {
            return errorHandler({ error, setErrorMessage })
        }
    }

    // reset
    const handelReset = async () => {
        try {
            setLoading(true)
            setActiveSortBy('')
            setSearchTerm('')
            setSortBy('')
            setSortOrder('desc')
            setDataPerPage(10)
            setCurrentPage(1)
            const response = await axios.get(`${config.api}/doctor/patient/all`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setLoading(false)
            setErrorMessage(null)
            dispatch(storePatient(response.data.data))
            dispatch(totalItemsCount(response.data.totalItems))
            dispatch(fetchedItemsCount(response.data.fetchedItems))
        } catch (error) {
            return errorHandler({ error, setErrorMessage })
        }
    }
    const handelErrorMessage = () => {
        setErrorMessage(null)
    }
    const handelDetails = (patientId) => {
        router.push(`/doctor/patients/${patientId}`)
    }


    // update patient information
    const [updateModal, setUpdateModal] = useState(false)
    const [addLoading, setAddLoading] = useState(false);
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        phone: '',
        email: '',
        address: '',
        age: '',
        gender: '',
        blood_group: '',
        emergency_contact_name: '',
        emergency_contact_number: '',
        emergency_contact_relation: '',
        errors: []

    })
    const toggleUpdateModal = (patient) => {
        setUpdateModal(!updateModal)
        setFormData({
            id: '',
            name: '',
            phone: '',
            email: '',
            address: '',
            age: '',
            gender: '',
            blood_group: '',
            emergency_contact_name: '',
            emergency_contact_number: '',
            emergency_contact_relation: '',
            errors: []
        });
        if (patient) {
            setFormData(prevFormData => ({
                ...prevFormData,
                id: patient.id,
                name: patient.name,
                phone: patient.phone,
                email: patient.email ?? '',
                address: patient.address,
                age: patient.age,
                gender: patient.gender ?? '',
                blood_group: patient.blood_group ?? '',
                emergency_contact_name: patient.emergency_contact_name ?? '',
                emergency_contact_number: patient.emergency_contact_number ?? '',
                emergency_contact_relation: patient.emergency_contact_relation ?? '',
            }));
        }
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
    const patientUpdateFormSubmit = async () => {
        try {
            const data = {
                name: formData.name,
                address: formData.address,
                age: parseInt(formData.age),
                gender: formData.gender,
                phone: formData.phone,
                email: formData.email,
                blood_group: formData.blood_group,
                emergency_contact_name: formData.emergency_contact_name,
                emergency_contact_number: formData.emergency_contact_number,
                emergency_contact_relation: formData.emergency_contact_relation,
            }
            setAddLoading(true)
            const res = await axios.post(`${config.api}/doctor/patient/update/${formData.id}`, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setAddLoading(false)
            toast(res.data.message)
            setUpdateModal(!updateModal)
            fetchData()
        } catch (error) {
            console.log(error)
            setAddLoading(false)
            errorHandler({ error, toast, formData, setFormData })
        }
    }


    return (
        <div className={`py-3 ${styles.listArea}`}>
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
            <div className="row">
                <div className="col-md-3">
                    <div className={`${styles.filterHeader}`}>
                        <span className='text-uppercase'>Show</span>
                        <select
                            value={dataPerPage}
                            className={`${styles.customSelect} form-select`}
                            onChange={(e) =>
                                setDataPerPage(parseInt(e.target.value))
                            }>
                            <option value="5" defaultValue={dataPerPage === 5}>05</option>
                            <option value="10" defaultValue={dataPerPage === 10}>10</option>
                            <option value="25" defaultValue={dataPerPage === 25}>25</option>
                            <option value="50" defaultValue={dataPerPage === 50}>50</option>
                            <option value="75" defaultValue={dataPerPage === 75}>75</option>
                            <option value="100" defaultValue={dataPerPage === 100}>100</option>
                        </select>
                    </div>
                </div>
                <div className="col-md-9">
                    <div className={`input-group ${styles.searchArea}`}>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handelSearch}
                            placeholder={`search for patient`}
                            className={`form-control ${styles.searchBox}`} />
                        <button
                            onClick={handelSearchSubmit}
                            className='btn btn-outline-secondary'
                            style={{ border: "none" }}>
                            <CiSearch size="24px" />
                        </button>
                        <button
                            onClick={handelReset}
                            className='btn btn-outline-secondary ms-2'
                            style={{ border: "none" }}>
                            <MdOutlineRefresh size="24px" />
                        </button>
                    </div>
                </div>
            </div>
            {
                loading ?
                    <div className={styles.loadingArea}>
                        <SyncLoader color='#36D7B7' size="12" />
                    </div> :
                    <div className="list-area">
                        {
                            reduxStorePatient.length > 0 ?
                                <div className='p-3 mt-3 table-area'>
                                    <Table responsive bordered size="sm" style={{ fontSize: "14px" }}>
                                        <thead className='p-3 custom-scrollbar'>
                                            <tr>
                                                <th className='text-center'>
                                                    <SortingArrow
                                                        level={`PATIENT ID`}
                                                        sortBy={`patients.id`}
                                                        sortOrder={sortOrder}
                                                        activeSortBy={activeSortBy}
                                                        handleSortOrderChange={handleSortOrderChange} />
                                                </th>
                                                <th>
                                                    <SortingArrow
                                                        level={`NAME`}
                                                        sortBy={`patients.name`}
                                                        sortOrder={sortOrder}
                                                        activeSortBy={activeSortBy}
                                                        handleSortOrderChange={handleSortOrderChange} />
                                                </th>
                                                <th className='text-center'>
                                                    <SortingArrow
                                                        level={`PHONE`}
                                                        sortBy={`patients.phone`}
                                                        sortOrder={sortOrder}
                                                        activeSortBy={activeSortBy}
                                                        handleSortOrderChange={handleSortOrderChange} />
                                                </th>
                                                <th className='text-center'>
                                                    <SortingArrow
                                                        level={`AGE`}
                                                        sortBy={`patients.age`}
                                                        sortOrder={sortOrder}
                                                        activeSortBy={activeSortBy}
                                                        handleSortOrderChange={handleSortOrderChange} />
                                                </th>
                                                <th className='text-center'>
                                                    <SortingArrow
                                                        level={`EMAIL`}
                                                        sortBy={`patients.email`}
                                                        sortOrder={sortOrder}
                                                        activeSortBy={activeSortBy}
                                                        handleSortOrderChange={handleSortOrderChange} />
                                                </th>
                                                <th className='text-center'>
                                                    <SortingArrow
                                                        level={`GENDER`}
                                                        sortBy={`patients.gender`}
                                                        sortOrder={sortOrder}
                                                        activeSortBy={activeSortBy}
                                                        handleSortOrderChange={handleSortOrderChange} />
                                                </th>
                                                <th className='text-center'>
                                                    <SortingArrow
                                                        level={`BLOOD GROUP`}
                                                        sortBy={`patients.blood_group`}
                                                        sortOrder={sortOrder}
                                                        activeSortBy={activeSortBy}
                                                        handleSortOrderChange={handleSortOrderChange} />
                                                </th>
                                                <th className='text-center'>
                                                    <SortingArrow
                                                        level={`ADDRESS`}
                                                        sortBy={`patients.address`}
                                                        sortOrder={sortOrder}
                                                        activeSortBy={activeSortBy}
                                                        handleSortOrderChange={handleSortOrderChange} />
                                                </th>
                                                <th className='text-center'>ACTION</th>
                                            </tr>
                                        </thead>
                                        <tbody className='p-3'>
                                            {
                                                reduxStorePatient.map((data, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td className='text-center table-element'>{String(data.id).padStart(5, '0')}</td>
                                                            <td className='table-element'>{data.name}</td>
                                                            <td className='table-element'>{data.phone}</td>
                                                            <td className='table-element'>{data.age}</td>
                                                            {
                                                                data.email ?
                                                                    <td className='table-element'>{data.email}</td> :
                                                                    <td className='table-element text-center fw-bold'>--</td>
                                                            }
                                                            <td className='table-element text-center'>{data.gender ?? <span className='fw-bold'>--</span>}</td>
                                                            <td className='table-element text-center'>{data.blood_group ?? <span className='fw-bold'>--</span>}</td>
                                                            <td className='table-element'>{data.address}</td>
                                                            <td>
                                                                <div className='d-flex justify-content-center table-btn'>
                                                                    <button style={{ border: "0" }} onClick={() => toggleUpdateModal(data)} className='btn btn-success btn-sm mx-1'><AiFillEdit className='mb-1' /></button>
                                                                    <button style={{ border: "0" }} onClick={() => handelDetails(data.id)} className='btn btn-primary btn-sm mx-1'><AiFillEye className='mb-1' /></button>
                                                                    <button style={{ border: "0" }} onClick={() => toggleDeleteModal(data.id, data.name)} className='btn btn-danger btn-sm mx-1'><AiFillDelete className='mb-1' /></button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </Table>
                                    <div className={`${styles.pagination}`} style={{ marginTop: "0px" }}>
                                        {
                                            reduxStorePatient.length > 0 ?
                                                <div className="d-flex justify-content-end">
                                                    <div>
                                                        <Pagination totalItem={fetchedItems}
                                                            dataPerPage={dataPerPage}
                                                            currentPage={currentPage}
                                                            handelPaginate={(pageNumber) => {
                                                                setCurrentPage(pageNumber)
                                                            }} />
                                                        <div className='d-flex justify-content-end'
                                                            style={{ margin: "12px 6px 0 0", fontWeight: "bold", color: "#0B5ED7" }}>
                                                            showing {reduxStorePatient.length} out of {totalItems}
                                                        </div>
                                                    </div>
                                                </div>
                                                : null
                                        }
                                    </div>
                                </div> :
                                (
                                    found ? <div className={styles.notFound}>
                                        <h6 className='fw-bold'>no patient found.</h6>
                                    </div> : null
                                )
                        }
                    </div>
            }
            {
                deleteModal ? (
                    <div>
                        <Modal isOpen={deleteModal} className="modal-md" onClick={toggleDeleteModal}>
                            <ModalBody>
                                <div className='p-3'>
                                    <h6 className='fw-bold text-center'>are you sure want to delete <span className='text-primary'>{deleteItem?.name ?? null}</span> patient?</h6>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <div className='d-flex'>
                                    <button onClick={toggleDeleteModal} className='btn btn-primary btn-sm fw-bold me-2'>close</button>
                                    <button onClick={handelDelete} className='btn btn-danger btn-sm fw-bold'>delete</button>
                                </div>
                            </ModalFooter>
                        </Modal>
                    </div>
                ) : null
            }
            {
                updateModal ? (
                    <div>
                        <Modal isOpen={updateModal} className="modal-xl">
                            <ModalBody>
                                <div className='p-3'>
                                    <div
                                        className='d-flex justify-content-between alert alert-success w-100 mb-4'
                                        style={{ padding: "14px 14px 8px", borderRadius: "2px" }}>
                                        <h4 className='text-uppercase fw-bold'>update patient information</h4>
                                        <ImCross size="24px"
                                            style={{ cursor: "pointer", color: "red", paddingTop: "4px" }}
                                            onClick={toggleUpdateModal} />
                                    </div>
                                    {/* <pre>{JSON.stringify(formData, null, 2)}</pre> */}
                                    <div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className='mb-3'>
                                                    <label className='mb-2'>
                                                        <span className='fw-bold'>NAME</span>
                                                        <AiFillStar className='required' />
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        value={formData.name}
                                                        onChange={handelInputChange}
                                                        placeholder='patient name'
                                                        className={`form-control ${formData.errors?.name ? 'is-invalid' : null}`} />
                                                    <small className='validation-error'>
                                                        {
                                                            formData.errors?.name ? formData.errors?.name : null
                                                        }
                                                    </small>
                                                </div>
                                                <div className='mb-3'>
                                                    <label className='mb-2'>
                                                        <span className='fw-bold'>PHONE</span>
                                                        <AiFillStar className='required' />
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="phone"
                                                        value={formData.phone}
                                                        onChange={handelInputChange}
                                                        placeholder='patient phone'
                                                        className={`form-control ${formData.errors?.phone ? 'is-invalid' : null}`} />
                                                    <small className='validation-error'>
                                                        {
                                                            formData.errors?.phone ? formData.errors?.phone : null
                                                        }
                                                    </small>
                                                </div>
                                                <div className='mb-3'>
                                                    <label className='mb-2'>
                                                        <span className='fw-bold'>AGE</span>
                                                        <AiFillStar className='required' />
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="age"
                                                        value={formData.age}
                                                        onChange={handelInputChange}
                                                        placeholder='patient age'
                                                        className={`form-control ${formData.errors?.age ? 'is-invalid' : null}`} />
                                                    <small className='validation-error'>
                                                        {
                                                            formData.errors?.age ? formData.errors?.age : null
                                                        }
                                                    </small>
                                                </div>
                                                <div className='mb-3'>
                                                    <label className='mb-2'>
                                                        <span className='fw-bold'>BLOOD GROUP</span>
                                                        {/* <AiFillStar className='required' /> */}
                                                    </label>
                                                    <select
                                                        name="blood_group"
                                                        value={formData.blood_group}
                                                        onChange={handelInputChange}
                                                        className={`form-control ${formData.errors?.blood_group ? 'is-invalid' : null}`}>
                                                        <option value="">select blood group</option>
                                                        <option value="A+">A+</option>
                                                        <option value="A-">A-</option>
                                                        <option value="B+">B+</option>
                                                        <option value="B-">B-</option>
                                                        <option value="AB+">AB+</option>
                                                        <option value="AB-">AB-</option>
                                                        <option value="O+">O+</option>
                                                        <option value="O-">O-</option>
                                                    </select>
                                                    <small className='validation-error'>
                                                        {formData.errors?.blood_group ? formData.errors?.blood_group : null}
                                                    </small>
                                                </div>
                                                <div className='mb-3'>
                                                    <label className='mb-2'>
                                                        <span className='fw-bold'>EMERGENCY CONTACT NAME</span>
                                                        {/* <AiFillStar className='required' /> */}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="emergency_contact_name"
                                                        value={formData.emergency_contact_name}
                                                        onChange={handelInputChange}
                                                        placeholder='patient emergency contact name'
                                                        className={`form-control ${formData.errors?.emergency_contact_name ? 'is-invalid' : null}`} />
                                                    <small className='validation-error'>
                                                        {
                                                            formData.errors?.emergency_contact_name ? formData.errors?.emergency_contact_name : null
                                                        }
                                                    </small>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className='mb-3'>
                                                    <label className='mb-2'>
                                                        <span className='fw-bold'>ADDRESS</span>
                                                        <AiFillStar className='required' />
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="address"
                                                        value={formData.address}
                                                        onChange={handelInputChange}
                                                        placeholder='patient address'
                                                        className={`form-control ${formData.errors?.address ? 'is-invalid' : null}`} />
                                                    <small className='validation-error'>
                                                        {
                                                            formData.errors?.address ? formData.errors?.address : null
                                                        }
                                                    </small>
                                                </div>
                                                <div className='mb-3'>
                                                    <label className='mb-2'>
                                                        <span className='fw-bold'>EMAIL</span>
                                                        {/* <AiFillStar className='required' /> */}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handelInputChange}
                                                        placeholder='patient email'
                                                        className={`form-control ${formData.errors?.email ? 'is-invalid' : null}`} />
                                                    <small className='validation-error'>
                                                        {
                                                            formData.errors?.email ? formData.errors?.email : null
                                                        }
                                                    </small>
                                                </div>
                                                <div className='mb-3'>
                                                    <label className='mb-2'>
                                                        <span className='fw-bold'>GENDER</span>
                                                        <AiFillStar className='required' />
                                                    </label>
                                                    <select
                                                        name="gender"
                                                        value={formData.gender}
                                                        onChange={handelInputChange}
                                                        className={`form-control ${formData.errors?.gender ? 'is-invalid' : null}`}
                                                    >
                                                        <option value="">select gender</option>
                                                        <option value="male">Male</option>
                                                        <option value="female">Female</option>
                                                        <option value="other">Other</option>
                                                    </select>
                                                    <small className='validation-error'>
                                                        {formData.errors?.gender ? formData.errors?.gender : null}
                                                    </small>
                                                </div>
                                                <div className='mb-3'>
                                                    <label className='mb-2'>
                                                        <span className='fw-bold'>EMERGENCY CONTACT NUMBER</span>
                                                        {/* <AiFillStar className='required' /> */}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="emergency_contact_number"
                                                        value={formData.emergency_contact_number}
                                                        onChange={handelInputChange}
                                                        placeholder='patient emergency contact number'
                                                        className={`form-control ${formData.errors?.emergency_contact_number ? 'is-invalid' : null}`} />
                                                    <small className='validation-error'>
                                                        {
                                                            formData.errors?.emergency_contact_number ? formData.errors?.emergency_contact_number : null
                                                        }
                                                    </small>
                                                </div>
                                                <div className='mb-3'>
                                                    <label className='mb-2'>
                                                        <span className='fw-bold'>EMERGENCY CONTACT RELATION</span>
                                                        {/* <AiFillStar className='required' /> */}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="emergency_contact_relation"
                                                        value={formData.emergency_contact_relation}
                                                        onChange={handelInputChange}
                                                        placeholder='patient emergency contact relation'
                                                        className={`form-control ${formData.errors?.emergency_contact_relation ? 'is-invalid' : null}`} />
                                                    <small className='validation-error'>
                                                        {
                                                            formData.errors?.emergency_contact_relation ? formData.errors?.emergency_contact_relation : null
                                                        }
                                                    </small>
                                                </div>
                                            </div>
                                            {
                                                addLoading ?
                                                    <button
                                                        disabled
                                                        style={{ borderRadius: "2px" }}
                                                        className='mt-3 fw-bold w-100 btn btn-primary'>
                                                        submitting...
                                                    </button> :
                                                    <button
                                                        style={{ borderRadius: "2px" }}
                                                        onClick={patientUpdateFormSubmit}
                                                        className='mt-3 fw-bold w-100 btn btn-primary'>
                                                        submit
                                                    </button>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </ModalBody>
                        </Modal>
                    </div>
                ) : null
            }
        </div>
    );
};

export default PatientList;




