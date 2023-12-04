import React, { useEffect, useState } from 'react';
import styles from "@/styles/administrator/List.module.css"
import { USER_STATUS } from '@/constant';
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io"
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

const DoctorList = () => {
    const token = Cookies.get('token');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [filterByStatus, setFilterByStatus] = useState(USER_STATUS.SHOW_ALL);
    const [filterByDepartment, setFilterByDepartment] = useState(USER_STATUS.SHOW_ALL);
    const [activeSortBy, setActiveSortBy] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [sortOrder, setSortOrder] = useState('asc')
    const [data, setData] = useState({
        doctors: [],
        totalItems: 0,
        fetchedItems: 0
    });
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
                status: filterByStatus === USER_STATUS.SHOW_ALL ? '' : filterByStatus,
                sortOrder: sortOrder,
                sortBy: sortBy,
                department: filterByDepartment === USER_STATUS.SHOW_ALL ? '' : filterByDepartment
            }
            const response = await axios.get(`${config.api}/administrator/doctor/all`, {
                params: data,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setErrorMessage(null)
            setData({
                doctors: response.data.data,
                totalItems: response.data.totalItems,
                fetchedItems: response.data.fetchedItems
            });
        } catch (error) {
            return errorHandler({ error, setErrorMessage })
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchData()
    }, [currentPage, dataPerPage, filterByStatus, filterByDepartment, sortOrder, sortBy])


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
    const handelFilterByDepartment = (event) => {
        setFilterByDepartment(event.target.value);
        setDepartmentToggle(!departmentToggle)
    }
    const [departmentToggle, setDepartmentToggle] = useState(false)
    const handelDepartmentToggle = () => {
        setDepartmentToggle(!departmentToggle)
    }

    // filter by status
    const userStatus = [
        USER_STATUS.SHOW_ALL,
        USER_STATUS.ACTIVE,
        USER_STATUS.DISABLE,
        USER_STATUS.PENDING
    ]
    const handelFilterByStatus = (event) => {
        setFilterByStatus(event.target.value);
        setStatusToggle(!statusToggle)
    }
    const [statusToggle, setStatusToggle] = useState(false)
    const handelStatusToggle = () => {
        setStatusToggle(!statusToggle)
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
            const data = {
                'userId': userId,
                'status': event.target.value
            }
            setLoading(true)
            const response = await axios.post(`${config.api}/administrator/doctor/update/status`, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setLoading(false)
            setErrorMessage(null)
            if (response.data.status) {
                await fetchData()
            }
        } catch (error) {
            setLoading(false)
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
            setLoading(true)
            await axios.delete(`${config.api}/administrator/doctor/${deleteItem?.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
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
            setFilterByDepartment(USER_STATUS.SHOW_ALL)
            setFilterByStatus(USER_STATUS.SHOW_ALL)
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
            setData({
                doctors: response.data.data,
                totalItems: response.data.totalItems,
                fetchedItems: response.data.fetchedItems
            });
        } catch (error) {
            return errorHandler({ error, setErrorMessage })
        } finally {
            setLoading(false)
        }
    }
    const handelErrorMessage = () => {
        setErrorMessage(null)
    }
    return (
        <div className={`py-3 ${styles.listArea}`}>
            {
                loading ? null : (
                    errorMessage ? (
                        <div className="alert alert-danger fw-bold">
                            <div className='d-flex justify-content-between'>
                                internal server error
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
                    <div className={styles.filterArea}>
                        <button className='text-uppercase' onClick={handelStatusToggle}>
                            <span>Status</span>
                            <div>
                                <span>
                                    {
                                        statusToggle ?
                                            <IoIosArrowUp size="16px" className={styles.dropdownIcon} />
                                            : <IoIosArrowDown size="16px" className={styles.dropdownIcon} />
                                    }
                                </span>
                            </div>
                        </button>
                        <div className={`${statusToggle ? styles.show : styles.hide}`}>
                            {
                                userStatus.map((status, index) => (
                                    <div key={index}>
                                        <label htmlFor={`status_${index}`} className={styles.radioArea}>
                                            <input
                                                className={`${styles.radioInput}`}
                                                type="radio"
                                                name="status"
                                                id={`status_${index}`}
                                                value={status}
                                                checked={filterByStatus === status}
                                                onChange={handelFilterByStatus}
                                            />
                                            {status}
                                        </label>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className={styles.filterArea}>
                        <button className='text-uppercase' onClick={handelDepartmentToggle}>
                            <span>Department</span>
                            <div>
                                <span>
                                    {
                                        departmentToggle ?
                                            <IoIosArrowUp size="16px" className={styles.dropdownIcon} />
                                            : <IoIosArrowDown size="16px" className={styles.dropdownIcon} />
                                    }
                                </span>
                            </div>
                        </button>
                        <div className={`${departmentToggle ? `${styles.show} ${styles.scrollable}` : styles.hide}`}>
                            {
                                departmentNames.length > 0 ? (
                                    departmentNames.map((name, index) => (
                                        <div key={index}>
                                            <label htmlFor={`name_${index}`} className={styles.radioArea}>
                                                <input
                                                    className={`${styles.radioInput}`}
                                                    type="radio"
                                                    name="name"
                                                    id={`name_${index}`}
                                                    value={name}
                                                    checked={filterByDepartment === name}
                                                    onChange={handelFilterByDepartment}
                                                />
                                                {name}
                                            </label>
                                        </div>
                                    ))
                                ) : (
                                    <div className='text-center py-1'>no data found.</div>
                                )
                            }

                        </div>
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
                            data.doctors.length > 0 ?
                                <div className='p-3 mt-3 table-area'>
                                    <Table striped hover responsive>
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
                                                        level={`DEPARTMENT`}
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
                                                data.doctors.map((data, index) => {
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
                                            data.doctors.length > 0 ?
                                                <Pagination totalItem={data.fetchedItems}
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




