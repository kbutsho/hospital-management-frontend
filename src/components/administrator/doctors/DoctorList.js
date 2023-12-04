import React, { useEffect, useState } from 'react';
import styles from "@/styles/administrator/List.module.css"
import { USER_STATUS } from '@/constant';
import { config } from "@/config/index";
import Cookies from 'js-cookie';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FadeLoader } from 'react-spinners';
import { AiFillDelete, AiFillEdit, AiFillEye } from 'react-icons/ai';
import { Table } from 'react-bootstrap';
import Pagination from '@/helpers/pagination';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import { errorHandler } from '@/helpers/errorHandler';
import SortingArrow from '@/helpers/sorting/SortingArrow';
import { CiSearch } from "react-icons/ci";
import { MdOutlineRefresh } from "react-icons/md";
import { ImCross } from "react-icons/im";
import { useDispatch, useSelector } from 'react-redux';
import { fetchedItemsCount, removeDoctor, storeDoctor, totalItemsCount, updateDoctorStatus } from '@/redux/slice/administrator/doctorSlice';
import Select from 'react-select';


const DoctorList = () => {
    const dispatch = useDispatch();
    const token = Cookies.get('token');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [filterByStatus, setFilterByStatus] = useState(null);
    const [filterByDepartment, setFilterByDepartment] = useState(null);
    const [activeSortBy, setActiveSortBy] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [sortOrder, setSortOrder] = useState('asc')
    const [departmentNames, setDepartmentNames] = useState([]);
    const [deleteModal, setDeleteModal] = useState(false)
    const [deleteItem, setDeleteItem] = useState({
        id: '',
        name: ''
    })

    // pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [dataPerPage, setDataPerPage] = useState(10);
    const handelPaginate = (pageNumber) => {
        setCurrentPage(pageNumber)
    }
    // load data
    const fetchData = async () => {
        try {
            setLoading(true);
            const data = {
                perPage: dataPerPage,
                page: currentPage,
                searchTerm: searchTerm,
                status: filterByStatus?.value === USER_STATUS.SHOW_ALL ? '' : filterByStatus?.value,
                sortOrder: sortOrder,
                sortBy: sortBy,
                department: filterByDepartment?.value === USER_STATUS.SHOW_ALL ? '' : filterByDepartment?.value
            }
            const response = await axios.get(`${config.api}/administrator/doctor/all`, {
                params: data,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setErrorMessage(null)
            dispatch(storeDoctor(response.data.data))
            dispatch(totalItemsCount(response.data.totalItems))
            dispatch(fetchedItemsCount(response.data.fetchedItems))
        } catch (error) {
            return errorHandler({ error, setErrorMessage })
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchData()
    }, [currentPage, dataPerPage, filterByStatus, filterByDepartment, sortOrder, sortBy])

    const reduxStoreDoctor = useSelector(state => state.administrator_doctors.data);
    const totalItems = useSelector(state => state.administrator_doctors.totalItems);
    const fetchedItems = useSelector(state => state.administrator_doctors.fetchedItems);

    // load department
    useEffect(() => {
        const fetchDepartment = async () => {
            try {
                const response = await axios.get(`${config.api}/department/all`);
                const deptNames = response.data.data.map((dept) => dept.name);
                deptNames.unshift("show all");
                setDepartmentNames(deptNames);
                setErrorMessage(null)
            } catch (error) {
                return errorHandler({ error, setErrorMessage })
            }
        }
        fetchDepartment();
    }, [])

    // sort order
    const handleSortOrderChange = (order, sortField) => {
        setActiveSortBy(sortField)
        setSortBy(sortField);
        setSortOrder(order);
    };

    // filter by department
    const departmentOptions = departmentNames.map((name, index) => ({
        value: name,
        label: index === 0 ? `${name.split(" ")[1]} department` : `${name}`
    }));
    const handelFilterByDepartment = (newValue) => {
        setFilterByDepartment(newValue);
    }


    // filter by status
    const userStatus = [
        USER_STATUS.SHOW_ALL,
        USER_STATUS.ACTIVE,
        USER_STATUS.DISABLE,
        USER_STATUS.PENDING
    ]
    const userStatusOptions = userStatus.map((status, index) => ({
        value: status,
        label: index === 0 ? `${status.split(" ")[1]} status` : `${status}`
    }));
    const handelFilterByStatus = (newValue) => {
        setFilterByStatus(newValue);
    }

    // search 
    const handelSearch = (event) => {
        setSearchTerm(event.target.value);
    };
    const handelSearchSubmit = async () => {
        try {
            setLoading(true);
            await fetchData();
        } catch (error) {
            return errorHandler({ error, setErrorMessage })
        } finally {
            setSearchTerm('')
            setLoading(false)
        }
    }

    // update status
    const handleStatusChange = async (event, userId) => {
        try {
            const status = event.target.value;
            const data = {
                'userId': userId,
                'status': status
            }
            setLoading(true)
            await axios.post(`${config.api}/administrator/doctor/update/status`, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            // await fetchData()
            setErrorMessage(null)
            dispatch(updateDoctorStatus({ userId, status }))
        } catch (error) {
            return errorHandler({ error, setErrorMessage })
        } finally {
            setLoading(false)
        }
    };

    // delete
    const toggleDeleteModal = (id, name) => {
        setDeleteModal(!deleteModal)
        setDeleteItem({ name: name ?? '', id: id ?? '' });
    }
    const handelDelete = async () => {
        try {
            setLoading(true)
            await axios.delete(`${config.api}/administrator/doctor/${deleteItem?.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            dispatch(removeDoctor(deleteItem?.id));
            toast.success("doctor deleted successfully!")
            setErrorMessage(null)
            await fetchData()
        } catch (error) {
            return errorHandler({ error, setErrorMessage })
        } finally {
            setLoading(false)
        }
    }

    // reset
    const handelReset = async () => {
        try {
            setLoading(true)
            setFilterByDepartment(null)
            setFilterByStatus(null)
            setActiveSortBy('')
            setSearchTerm('')
            setSortBy('')
            setSortOrder('asc')
            setDataPerPage(10)
            setCurrentPage(1)
            const response = await axios.get(`${config.api}/administrator/doctor/all`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setErrorMessage(null)
            dispatch(storeDoctor(response.data.data))
            dispatch(totalItemsCount(response.data.totalItems))
            dispatch(fetchedItemsCount(response.data.fetchedItems))
        } catch (error) {
            return errorHandler({ error, setErrorMessage })
        } finally {
            setLoading(false)
        }
    }
    const handelErrorMessage = () => {
        setErrorMessage(null)
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
                <div className="col-md-2">
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
                            onChange={handelFilterByStatus}
                            options={userStatusOptions}
                            isSearchable
                            placeholder="search or select status"
                            styles={customStyles}
                        />
                    </div>
                </div>
                <div className="col-md-3">
                    <div className={`${styles.customSelectFilter}`}>
                        <Select
                            value={filterByDepartment}
                            onChange={handelFilterByDepartment}
                            options={departmentOptions}
                            isSearchable
                            placeholder="search or select department"
                            styles={customStyles}
                        />
                    </div>
                </div>
                <div className="col-md-4">
                    <div className={`input-group ${styles.searchArea}`}>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handelSearch}
                            placeholder={`search for doctors`}
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
                        <FadeLoader color='#d3d3d3' size="16" />
                    </div> :
                    <div className="list-area">
                        {
                            reduxStoreDoctor.length > 0 ?
                                <div className='p-3 mt-3 table-area'>
                                    <Table striped hover responsive bordered>
                                        <thead className='p-3 custom-scrollbar'>
                                            <tr>
                                                <th>#</th>
                                                <th className='text-center'>
                                                    <SortingArrow
                                                        level={`USER ID`}
                                                        sortBy={`users.id`}
                                                        sortOrder={sortOrder}
                                                        activeSortBy={activeSortBy}
                                                        handleSortOrderChange={handleSortOrderChange} />
                                                </th>
                                                <th className='text-center'>
                                                    <SortingArrow
                                                        level={`DOCTOR ID`}
                                                        sortBy={`doctors.id`}
                                                        sortOrder={sortOrder}
                                                        activeSortBy={activeSortBy}
                                                        handleSortOrderChange={handleSortOrderChange} />
                                                </th>
                                                <th>
                                                    <SortingArrow
                                                        level={`NAME`}
                                                        sortBy={`name`}
                                                        sortOrder={sortOrder}
                                                        activeSortBy={activeSortBy}
                                                        handleSortOrderChange={handleSortOrderChange} />
                                                </th>
                                                <th>
                                                    <SortingArrow
                                                        level={`EMAIL`}
                                                        sortBy={`email`}
                                                        sortOrder={sortOrder}
                                                        activeSortBy={activeSortBy}
                                                        handleSortOrderChange={handleSortOrderChange} />
                                                </th>
                                                <th>
                                                    <SortingArrow
                                                        level={`PHONE`}
                                                        sortBy={`phone`}
                                                        sortOrder={sortOrder}
                                                        activeSortBy={activeSortBy}
                                                        handleSortOrderChange={handleSortOrderChange} />
                                                </th>
                                                <th>
                                                    <SortingArrow
                                                        level={`DEPT`}
                                                        sortBy={`departments.name`}
                                                        sortOrder={sortOrder}
                                                        activeSortBy={activeSortBy}
                                                        handleSortOrderChange={handleSortOrderChange} />
                                                </th>
                                                <th className='text-center'>
                                                    <SortingArrow
                                                        level={`BMDC ID`}
                                                        sortBy={`doctors.bmdc_id`}
                                                        sortOrder={sortOrder}
                                                        activeSortBy={activeSortBy}
                                                        handleSortOrderChange={handleSortOrderChange} />
                                                </th>
                                                <th className='text-center'>
                                                    <SortingArrow
                                                        level={`STATUS`}
                                                        sortBy={`users.status`}
                                                        sortOrder={sortOrder}
                                                        activeSortBy={activeSortBy}
                                                        handleSortOrderChange={handleSortOrderChange} />
                                                </th>
                                                <th className='text-center'>ACTION</th>
                                            </tr>
                                        </thead>
                                        <tbody className='p-3'>
                                            {
                                                reduxStoreDoctor.map((data, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td className='text-center'>{data.userId}</td>
                                                            <td className='text-center'>{data.doctorId}</td>
                                                            <td>{data.name}</td>
                                                            <td>{data.email}</td>
                                                            <td>{data.phone}</td>
                                                            <td>{data.departmentName}</td>
                                                            <td>{data.bmdc_id}</td>
                                                            <td className='text-center'>
                                                                <select
                                                                    className="status-select form-select fw-bold"
                                                                    value={data.status}
                                                                    onChange={(event) => handleStatusChange(event, data.userId)}
                                                                    style={{ color: data.status === 'active' ? 'green' : 'red' }}
                                                                >
                                                                    {Object.entries(USER_STATUS)
                                                                        .filter(([key, value]) => value !== USER_STATUS.SHOW_ALL)
                                                                        .map(([key, value]) => (
                                                                            <option key={key}
                                                                                value={value}
                                                                                className='fw-bold'
                                                                                style={{ color: value === 'active' ? 'green' : 'red' }}>
                                                                                {value}
                                                                            </option>
                                                                        ))}
                                                                </select>
                                                            </td>
                                                            <td >
                                                                <div className='d-flex justify-content-center'>
                                                                    <button className='btn btn-primary btn-sm mx-1'><AiFillEye className='mb-1' /></button>
                                                                    <button className='btn btn-success btn-sm mx-1'><AiFillEdit className='mb-1' /></button>
                                                                    <button onClick={() => toggleDeleteModal(data.doctorId, data.name)} className='btn btn-danger btn-sm mx-1'><AiFillDelete className='mb-1' /></button>
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
                                            reduxStoreDoctor.length > 0 ?
                                                <Pagination totalItem={fetchedItems}
                                                    dataPerPage={dataPerPage}
                                                    currentPage={currentPage}
                                                    handelPaginate={handelPaginate} />
                                                : null
                                        }
                                    </div>
                                </div> :
                                <div className={styles.notFound}>
                                    <h6 className='fw-bold'>no doctor found.</h6>
                                </div>
                        }
                    </div>
            }
            {
                deleteModal ? (
                    <div>
                        <Modal isOpen={deleteModal} className="modal-md" onClick={toggleDeleteModal}>
                            <ModalBody>
                                <div className='p-3'>
                                    <h6 className='fw-bold text-center'>are you sure want to delete <span className='text-primary'>{deleteItem?.name ?? null}</span> doctor?</h6>
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
        </div >
    );
};

export default DoctorList;




