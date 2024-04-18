import React, { useEffect, useState } from 'react';
import styles from "@/styles/administrator/List.module.css"
import { STATUS } from '@/constant';
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
import Select from 'react-select';
import {
    storeDepartment,
    totalItemsCount,
    fetchedItemsCount,
    updateDepartmentStatus,
    removeDepartment
} from '@/redux/slice/administrator/departmentSlice';
import { VscDiffAdded } from 'react-icons/vsc';
import Image from 'next/image';
import { useRouter } from 'next/router';


const DepartmentList = () => {
    const dispatch = useDispatch();
    const token = Cookies.get('token');
    const [loading, setLoading] = useState(false);
    const [found, setFound] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null);
    const [filterByStatus, setFilterByStatus] = useState(null);
    const [activeSortBy, setActiveSortBy] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [sortOrder, setSortOrder] = useState('desc')
    const [deleteModal, setDeleteModal] = useState(false)
    const [deleteItem, setDeleteItem] = useState({
        id: '',
        name: ''
    })
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        photo: null,
        errors: []
    })
    // pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [dataPerPage, setDataPerPage] = useState(5);

    // load data
    const fetchData = async () => {
        try {
            // setLoading(true);
            const data = {
                perPage: dataPerPage,
                page: currentPage,
                searchTerm: searchTerm,
                sortOrder: sortOrder,
                sortBy: sortBy,
                status: filterByStatus?.value === STATUS.SHOW_ALL ? '' : filterByStatus?.value,
            }
            const response = await axios.get(`${config.api}/administrator/department/all`, {
                params: data,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response.data.data)
            setErrorMessage(null)
            dispatch(storeDepartment(response.data.data))
            dispatch(totalItemsCount(response.data.totalItems))
            dispatch(fetchedItemsCount(response.data.fetchedItems))
            setFound(true)
        } catch (error) {
            console.log(error)
            return errorHandler({ error, setErrorMessage })
        }
    };
    useEffect(() => {
        fetchData()
    }, [currentPage, dataPerPage, filterByStatus, sortOrder, sortBy])

    const reduxStoreDepartment = useSelector(state => state.administrator_departments.data);
    const totalItems = useSelector(state => state.administrator_departments.totalItems);
    const fetchedItems = useSelector(state => state.administrator_departments.fetchedItems);

    // sort order
    const handleSortOrderChange = (order, sortField) => {
        setActiveSortBy(sortField)
        setSortBy(sortField);
        setSortOrder(order);
    };

    // filter by status
    const statusList = [
        STATUS.SHOW_ALL,
        STATUS.ACTIVE,
        STATUS.DISABLE,
        STATUS.PENDING
    ]
    const statusOptions = statusList.map((status, index) => ({
        value: status,
        label: index === 0 ? `${status.split(" ")[1]} status` : `${status}`
    }));

    // search 
    const handelSearch = (event) => {
        setSearchTerm(event.target.value);
    };
    const handelSearchSubmit = async () => {
        try {
            await fetchData();
        } catch (error) {
            return errorHandler({ error, setErrorMessage })
        } finally {
            setSearchTerm('')
        }
    }

    // update status
    const handleStatusChange = async (event, id) => {
        try {
            const status = event.target.value;
            const data = {
                'id': id,
                'status': status
            }
            await axios.post(`${config.api}/administrator/department/update/status`, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setErrorMessage(null)
            dispatch(updateDepartmentStatus({ id, status }))
        } catch (error) {
            return errorHandler({ error, setErrorMessage })
        }
    };

    // delete
    const toggleDeleteModal = (id, name) => {
        setDeleteModal(!deleteModal)
        setDeleteItem({ name: name ?? '', id: id ?? '' });
    }
    const handelDelete = async () => {
        try {
            await axios.delete(`${config.api}/administrator/department/${deleteItem?.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            dispatch(removeDepartment(deleteItem?.id));
            toast.success("department deleted successfully!")
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
            setFilterByStatus(null)
            setActiveSortBy('')
            setSearchTerm('')
            setSortBy('')
            setSortOrder('desc')
            setDataPerPage(5)
            setCurrentPage(1)
            const response = await axios.get(`${config.api}/administrator/department/all`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setLoading(false)
            setErrorMessage(null)
            dispatch(storeDepartment(response.data.data))
            dispatch(totalItemsCount(response.data.totalItems))
            dispatch(fetchedItemsCount(response.data.fetchedItems))
        } catch (error) {
            return errorHandler({ error, setErrorMessage })
        }
    }
    const handelErrorMessage = () => {
        setErrorMessage(null)
    }

    // add department 
    const [addModal, setAddModal] = useState(false);
    const [addLoading, setAddLoading] = useState(false);
    const toggleAddModal = () => {
        setAddModal(!addModal);
        setFormData({
            name: '',
            photo: null,
            description: '',
            errors: []
        })
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
    const handelAddPhotoChange = (e) => {
        const { name, value, files } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: name === 'photo' ? files[0] : value,
            errors: {
                ...formData.errors,
                [e.target.name]: null
            }
        }));
    };
    const departmentFormSubmit = async (e) => {
        e.preventDefault();
        try {
            setAddLoading(true)
            const data = new FormData();
            data.append('photo', formData.photo);
            data.append('name', formData.name);
            data.append('description', formData.description);
            // const data = {
            //     name: formData.name,
            //     photo: formData.photo,
            //     description: formData.description
            // }
            const response = await axios.post(`${config.api}/administrator/department/create`, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.data.status) {
                setFormData({
                    name: '',
                    errors: []
                });
                await fetchData()
                setAddModal(!addModal);
                toast.success(response.data.message)
            }
        } catch (error) {
            return errorHandler({ error, toast, setFormData, formData })
        }
        finally {
            setAddLoading(false);
        }
    }

    const customStyles = {
        control: (provided) => ({
            ...provided,
            border: 'none',
            boxShadow: 'none',
            cursor: 'pointer'
        }),
        option: (provided) => ({
            ...provided,
            cursor: 'pointer',
            'textTransform': 'uppercase',
            fontSize: '12px'
        }),
    };
    const statusColors = {
        [STATUS.ACTIVE]: 'green',
        [STATUS.PENDING]: 'red',
        [STATUS.DISABLE]: 'grey'
    };
    const router = useRouter()
    const deptDetails = (id) => {
        router.push(`/administrator/departments/${id}`);
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
                <div className="col-md-3">
                    <div className={`${styles.customSelectFilter}`}>
                        <Select
                            value={filterByStatus}
                            onChange={(newValue) => {
                                setFilterByStatus(newValue);
                            }}
                            options={statusOptions}
                            isSearchable
                            placeholder="search or select status"
                            styles={customStyles}
                        />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className={`input-group ${styles.searchArea}`}>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handelSearch}
                            placeholder={`search for departments`}
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
                        <button
                            onClick={toggleAddModal}
                            className='btn btn-outline-secondary ms-2'
                            style={{ border: "none", "borderRadius": "0px 4px 4px 0" }}>
                            <VscDiffAdded size="24px" />
                        </button>
                    </div>
                </div>
            </div>
            {
                loading ?
                    <div className={styles.loadingArea}>
                        <SyncLoader color='#d3d3d3' size="12" />
                    </div> :
                    <div className="list-area">
                        {
                            reduxStoreDepartment.length > 0 ?
                                <div className='p-3 mt-3 table-area'>
                                    <Table responsive bordered size="sm" style={{ fontSize: "14px" }}>
                                        <thead className='p-3 custom-scrollbar'>
                                            <tr>
                                                <th className='text-center'>
                                                    <SortingArrow
                                                        level={`DEPT ID`}
                                                        sortBy={`departments.id`}
                                                        sortOrder={sortOrder}
                                                        activeSortBy={activeSortBy}
                                                        handleSortOrderChange={handleSortOrderChange} />
                                                </th>
                                                <th>
                                                    <SortingArrow
                                                        level={`DEPARTMENT`}
                                                        sortBy={`departments.name`}
                                                        sortOrder={sortOrder}
                                                        activeSortBy={activeSortBy}
                                                        handleSortOrderChange={handleSortOrderChange} />
                                                </th>
                                                <th className='text-center'>
                                                    <SortingArrow
                                                        level={`AVAILABLE DOCTOR`}
                                                        sortBy={`activeDoctor`}
                                                        sortOrder={sortOrder}
                                                        activeSortBy={activeSortBy}
                                                        handleSortOrderChange={handleSortOrderChange} />
                                                </th>
                                                <th className='text-center'>
                                                    <SortingArrow
                                                        level={`PENDING DOCTOR`}
                                                        sortBy={`pendingDoctor`}
                                                        sortOrder={sortOrder}
                                                        activeSortBy={activeSortBy}
                                                        handleSortOrderChange={handleSortOrderChange} />
                                                </th>
                                                <th className='text-center'>
                                                    <SortingArrow
                                                        level={`DISABLED DOCTOR`}
                                                        sortBy={`disableDoctor`}
                                                        sortOrder={sortOrder}
                                                        activeSortBy={activeSortBy}
                                                        handleSortOrderChange={handleSortOrderChange} />
                                                </th>
                                                <th className='text-center' style={{ paddingBottom: "8px" }}>PHOTO</th>
                                                <th className='text-center'>
                                                    <SortingArrow
                                                        level={`STATUS`}
                                                        sortBy={`departments.status`}
                                                        sortOrder={sortOrder}
                                                        activeSortBy={activeSortBy}
                                                        handleSortOrderChange={handleSortOrderChange} />
                                                </th>
                                                <th className='text-center' style={{ paddingBottom: "8px" }}>ACTION</th>

                                            </tr>
                                        </thead>
                                        <tbody className='p-3'>
                                            {
                                                reduxStoreDepartment.map((data, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td className='text-center table-element'>{String(data.id).padStart(5, '0')}</td>
                                                            <td className='table-element'>{data.name}</td>
                                                            <td>
                                                                <div className='d-flex justify-content-around align-items-center'
                                                                    style={{
                                                                        margin: "3px",
                                                                        padding: "3px",
                                                                        fontWeight: "bold",
                                                                        color: typeof (data.activeDoctor) === 'object' ? 'black' : data.activeDoctor === 0 ? 'black' : 'white',
                                                                        cursor: typeof (data.activeDoctor) === 'object' ? 'not-allowed' : data.activeDoctor === 0 ? 'not-allowed' : 'pointer',
                                                                        background: typeof (data.activeDoctor) === 'object' ? '#D2E9E9' : data.activeDoctor === 0 ? '#D2E9E9' : '#0B5ED7',
                                                                    }}>
                                                                    {data.activeDoctor === null ? "0" : data.activeDoctor}
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className='d-flex justify-content-around align-items-center'
                                                                    style={{
                                                                        margin: "3px",
                                                                        padding: "3px",
                                                                        fontWeight: "bold",
                                                                        color: typeof (data.pendingDoctor) === 'object' ? 'black' : data.pendingDoctor === 0 ? 'black' : 'white',
                                                                        cursor: typeof (data.pendingDoctor) === 'object' ? 'not-allowed' : data.pendingDoctor === 0 ? 'not-allowed' : 'pointer',
                                                                        background: typeof (data.pendingDoctor) === 'object' ? '#D2E9E9' : data.pendingDoctor === 0 ? '#D2E9E9' : '#BB2D3B',
                                                                    }}>

                                                                    {data.pendingDoctor === null ? "0" : data.pendingDoctor}
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className='d-flex justify-content-around align-items-center'
                                                                    style={{
                                                                        margin: "3px",
                                                                        padding: "3px",
                                                                        fontWeight: "bold",
                                                                        color: typeof (data.disableDoctor) === 'object' ? 'black' : data.disableDoctor === 0 ? 'black' : 'white',
                                                                        cursor: typeof (data.disableDoctor) === 'object' ? 'not-allowed' : data.disableDoctor === 0 ? 'not-allowed' : 'pointer',
                                                                        background: typeof (data.disableDoctor) === 'object' ? '#D2E9E9' : data.disableDoctor === 0 ? '#D2E9E9' : '#BB2D3B',
                                                                    }}>
                                                                    {data.disableDoctor === null ? "0" : data.disableDoctor}
                                                                </div>
                                                            </td>
                                                            <td className='text-center'>
                                                                <Image src={`${config.backend_api}/uploads/department/${data.photo}`} height={30} width={30} alt="profile" />
                                                            </td>
                                                            <td className='text-center'>
                                                                <select
                                                                    className="status-select form-select fw-bold"
                                                                    value={data.status}
                                                                    onChange={(event) => handleStatusChange(event, data.id)}
                                                                    style={{
                                                                        color: statusColors[data.status] || 'inherit'
                                                                    }}>
                                                                    {Object.entries(STATUS)
                                                                        .filter(([key, value]) => value !== STATUS.SHOW_ALL)
                                                                        .map(([key, value]) => (
                                                                            <option key={key}
                                                                                value={value}
                                                                                className='fw-bold'
                                                                                style={{
                                                                                    color: statusColors[value] || 'inherit'
                                                                                }}>
                                                                                {value}
                                                                            </option>
                                                                        ))}
                                                                </select>
                                                            </td>
                                                            <td>
                                                                <div className='d-flex justify-content-center table-btn'>
                                                                    <button style={{ border: "0" }} onClick={() => deptDetails(data.id)} className='btn btn-primary btn-sm mx-1'><AiFillEye className='mb-1' /></button>
                                                                    <button style={{ border: "0" }} className='btn btn-success btn-sm mx-1'><AiFillEdit className='mb-1' /></button>
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
                                            reduxStoreDepartment.length > 0 ?
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
                                                            showing {reduxStoreDepartment.length} out of {totalItems}
                                                        </div>
                                                    </div>
                                                </div>
                                                : null
                                        }
                                    </div>
                                </div> :
                                (
                                    found ? <div className={styles.notFound}>
                                        <h6 className='fw-bold'>no department found.</h6>
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
                                    <h6 className='fw-bold text-center'>are you sure want to delete <span className='text-primary'>{deleteItem?.name ?? null}</span> department?</h6>
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
                addModal ? (
                    <div>
                        <Modal isOpen={addModal} className="modal-lg">
                            <ModalBody>
                                <div className='p-3'>
                                    <pre>{JSON.stringify(formData, null, 2)}</pre>
                                    <div className='d-flex justify-content-between'>
                                        <h4 className='text-uppercase fw-bold mb-4'>Add Department</h4>
                                        <ImCross size="24px"
                                            className='pt-2'
                                            style={{ cursor: "pointer", color: "red" }}
                                            onClick={toggleAddModal} />
                                    </div>
                                    <form onSubmit={departmentFormSubmit} encType='multiple/form-data'>
                                        <div className='mb-4'>
                                            <label className='mb-3'>
                                                <span className='fw-bold'>DEPARTMENT NAME</span>
                                                <AiFillStar className='required' />
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handelInputChange}
                                                placeholder='write department name'
                                                className={`form-control ${formData.errors?.name ? 'is-invalid' : null}`} />
                                            <small className='validation-error'>
                                                {
                                                    formData.errors?.name ? formData.errors?.name : null
                                                }
                                            </small>
                                        </div>
                                        <div className='mb-4'>
                                            <label className='mb-3'>
                                                <span className='fw-bold'>PHOTO</span>
                                                <AiFillStar className='required' />
                                            </label>
                                            <input
                                                type="file"
                                                name="photo"
                                                onChange={handelAddPhotoChange}
                                                className={`form-control ${formData.errors?.photo ? 'is-invalid' : null}`} />
                                            <small className='validation-error'>
                                                {
                                                    formData.errors?.photo ? formData.errors?.photo : null
                                                }
                                            </small>
                                        </div>
                                        <div className='mb-4'>
                                            <label className='mb-3'>
                                                <span className='fw-bold'>DESCRIPTION</span>
                                                <AiFillStar className='required' />
                                            </label>
                                            <textarea
                                                rows="4"
                                                type="text"
                                                name="description"
                                                value={formData.description}
                                                onChange={handelInputChange}
                                                placeholder='write department description'
                                                className={`form-control ${formData.errors?.description ? 'is-invalid' : null}`} />
                                            <small className='validation-error'>
                                                {
                                                    formData.errors?.description ? formData.errors?.description : null
                                                }
                                            </small>
                                        </div>
                                        {
                                            addLoading ?
                                                <button disabled className='mt-3 fw-bold w-100 btn btn-primary'>submitting...</button> :
                                                <input type="submit" value="submit" className='mt-3 fw-bold w-100 btn btn-primary' />
                                        }
                                    </form>
                                </div>
                            </ModalBody>
                        </Modal>
                    </div>
                ) : null
            }
        </div>
    );
};

export default DepartmentList;




