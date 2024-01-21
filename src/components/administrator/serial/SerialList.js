import React, { useEffect, useState } from 'react';
import styles from "@/styles/administrator/List.module.css"
import { STATUS } from '@/constant';
import { config } from "@/config/index";
import Cookies from 'js-cookie';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FadeLoader } from 'react-spinners';
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
import { VscDiffAdded } from 'react-icons/vsc';
import {
    storeSerial,
    totalItemsCount,
    fetchedItemsCount,
    updateSerialStatus,
    removeSerial
} from '@/redux/slice/administrator/serialSlice';



const SerialList = () => {
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
    const [deleteItem, setDeleteItem] = useState({ id: '', name: '' })

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
                sortBy: sortBy,
                status: filterByStatus?.value === STATUS.SHOW_ALL ? '' : filterByStatus?.value,
                // filterByDate
                // filterByDoctor
                // FIlterBySchedule
            }
            const response = await axios.get(`${config.api}/administrator/serial/all`, {
                params: data,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response.data.data)
            setErrorMessage(null)
            dispatch(storeSerial(response.data.data))
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

    const reduxStoreSerial = useSelector(state => state.administrator_serials.data);
    const totalItems = useSelector(state => state.administrator_serials.totalItems);
    const fetchedItems = useSelector(state => state.administrator_serials.fetchedItems);

    // sort order
    const handleSortOrderChange = (order, sortField) => {
        setActiveSortBy(sortField)
        setSortBy(sortField);
        setSortOrder(order);
    };

    // filter by status
    const statusList = [
        STATUS.SHOW_ALL,
        STATUS.UNPAID,
        STATUS.PAID
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
            setSearchTerm('')
        } catch (error) {
            setSearchTerm('')
            return errorHandler({ error, setErrorMessage })
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
            await axios.post(`${config.api}/administrator/serial/update/status`, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setErrorMessage(null)
            dispatch(updateSerialStatus({ id, status }))
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
            await axios.delete(`${config.api}/administrator/serial/${deleteItem?.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            dispatch(removeSerial(deleteItem?.id));
            toast.success("serial deleted successfully!")
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
            setDataPerPage(10)
            setCurrentPage(1)
            const response = await axios.get(`${config.api}/administrator/serial/all`, {
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
    const departmentFormSubmit = async (e) => {
        e.preventDefault();
        try {
            setAddLoading(true)
            const data = {
                name: formData.name
            }
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
    const convertTime = (time24) => {
        const [hours, minutes] = time24.split(':');
        let formattedTime = '';
        let suffix = hours >= 12 ? 'PM' : 'AM';
        let hours12 = hours % 12 || 12;
        if (hours12 < 10) {
            hours12 = String(hours12).padStart(2, '0')
        }
        formattedTime = `${hours12}:${minutes} ${suffix}`;
        return formattedTime;
    };
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
        [STATUS.UNPAID]: 'red',
        [STATUS.PAID]: 'green'
    };


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
                        <FadeLoader color='#d3d3d3' size="16" />
                    </div> :
                    <div className="list-area">
                        {
                            reduxStoreSerial.length > 0 ?
                                <div className='p-3 mt-3 table-area'>
                                    <Table responsive bordered size="sm" style={{ fontSize: "13px" }}>
                                        <thead className='p-3 custom-scrollbar'>
                                            <tr>
                                                <th className='text-center'>
                                                    <SortingArrow
                                                        level={`SL ID`}
                                                        sortBy={`serials.id`}
                                                        sortOrder={sortOrder}
                                                        activeSortBy={activeSortBy}
                                                        handleSortOrderChange={handleSortOrderChange} />
                                                </th>
                                                <th>
                                                    <SortingArrow
                                                        level={`NAME`}
                                                        sortBy={`serials.name`}
                                                        sortOrder={sortOrder}
                                                        activeSortBy={activeSortBy}
                                                        handleSortOrderChange={handleSortOrderChange} />
                                                </th>
                                                <th className='text-center'>
                                                    <SortingArrow
                                                        level={`PHONE`}
                                                        sortBy={`serials.phone`}
                                                        sortOrder={sortOrder}
                                                        activeSortBy={activeSortBy}
                                                        handleSortOrderChange={handleSortOrderChange} />
                                                </th>
                                                <th className='text-center'>
                                                    <SortingArrow
                                                        level={`AGE`}
                                                        sortBy={`serials.age`}
                                                        sortOrder={sortOrder}
                                                        activeSortBy={activeSortBy}
                                                        handleSortOrderChange={handleSortOrderChange} />
                                                </th>
                                                <th className='text-center'>
                                                    <SortingArrow
                                                        level={`DEPT`}
                                                        sortBy={`serials.department`}
                                                        sortOrder={sortOrder}
                                                        activeSortBy={activeSortBy}
                                                        handleSortOrderChange={handleSortOrderChange} />
                                                </th>
                                                <th className='text-center'>
                                                    <SortingArrow
                                                        level={`DOCTOR`}
                                                        sortBy={`serials.doctor`}
                                                        sortOrder={sortOrder}
                                                        activeSortBy={activeSortBy}
                                                        handleSortOrderChange={handleSortOrderChange} />
                                                </th>
                                                <th className='text-center'>
                                                    <SortingArrow
                                                        level={`SCHEDULE`}
                                                        sortBy={`serial.schedule`}
                                                        sortOrder={sortOrder}
                                                        activeSortBy={activeSortBy}
                                                        handleSortOrderChange={handleSortOrderChange} />
                                                </th>
                                                <th className='text-center'>
                                                    <SortingArrow
                                                        level={`FEES`}
                                                        sortBy={`doctors_fees.fees`}
                                                        sortOrder={sortOrder}
                                                        activeSortBy={activeSortBy}
                                                        handleSortOrderChange={handleSortOrderChange} />
                                                </th>
                                                <th className='text-center'>
                                                    <SortingArrow
                                                        level={`STATUS`}
                                                        sortBy={`serial.payment_status`}
                                                        sortOrder={sortOrder}
                                                        activeSortBy={activeSortBy}
                                                        handleSortOrderChange={handleSortOrderChange} />
                                                </th>
                                                <th className='text-center'>ACTION</th>
                                            </tr>
                                        </thead>
                                        <tbody className='p-3'>
                                            {
                                                reduxStoreSerial.map((data, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td className='text-center table-element'>{String(data.id).padStart(5, '0')}</td>
                                                            <td className='table-element'>{data.name}</td>
                                                            <td className='table-element'>{data.phone}</td>
                                                            <td className='table-element'>{data.age}</td>
                                                            <td className='table-element'>{data.departmentName}</td>
                                                            <td className='table-element'>{data.doctorName}</td>
                                                            <td className='table-element'>{data.date.split('-').reverse().join('/')} {convertTime(data.opening_time)}</td>
                                                            <td className='table-element text-uppercase'>{data.fees}</td>
                                                            <td className='text-center'>
                                                                <select
                                                                    className="status-select form-select fw-bold"
                                                                    value={data.payment_status}
                                                                    onChange={(event) => handleStatusChange(event, data.id)}
                                                                    style={{
                                                                        color: statusColors[data.payment_status] || 'inherit'
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
                                                                    <button style={{ border: "0" }} className='btn btn-primary btn-sm mx-1'><AiFillEye className='mb-1' /></button>
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
                                            reduxStoreSerial.length > 0 ?
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
                                                            showing {reduxStoreSerial.length} out of {totalItems}
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
                        <Modal isOpen={addModal} className="modal-md">
                            <ModalBody>
                                <div className='p-3'>
                                    <div className='d-flex justify-content-between'>
                                        <h4 className='text-uppercase fw-bold mb-4'>Add Department</h4>
                                        <ImCross size="24px"
                                            className='pt-2'
                                            style={{ cursor: "pointer", color: "red" }}
                                            onClick={toggleAddModal} />
                                    </div>
                                    <form onSubmit={departmentFormSubmit}>
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

export default SerialList;




