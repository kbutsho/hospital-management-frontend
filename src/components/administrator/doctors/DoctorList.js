import React, { useCallback, useEffect, useState } from 'react';
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

const DoctorList = () => {
    const token = Cookies.get('token');
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState(false)
    const [data, setData] = useState();
    const [department, setDepartment] = useState([]);
    const [deleteItem, setDeleteItem] = useState({
        id: '',
        name: ''
    })
    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${config.api}/administrator/doctor/all`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setLoading(false);
            if (response.data.status) {
                setData(response.data.data);
            }
        } catch (error) {
            setLoading(false);
            if (error.response) {
                toast.error(error.response.data.error) // here toast message show 2 time. why?
            }
            else if (error.isAxiosError) {
                toast.error("network error. try again later!");
            }
            else {
                toast.error("unexpected error. try again later!");
            }
        }
    }, [setData, token, setLoading]);
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const fetchDepartment = useCallback(async () => {
        try {
            setLoading(true)
            const response = await axios.get(`${config.api}/department/all`);
            const departmentNames = response.data.data.map((dept) => dept.name);
            departmentNames.push("show all");
            setDepartment(departmentNames);
            setLoading(false)
        } catch (error) {
            setLoading(false)
            toast.error("internal server error!")
        }
    }, [setDepartment])
    useEffect(() => {
        fetchDepartment();
    }, [fetchDepartment]);


    // filter by department
    const [filterByDepartment, setFilterByDepartment] = useState('');
    const handelFilterByDepartment = (event) => {
        setFilterByDepartment(event.target.value);
    }
    const [departmentToggle, setDepartmentToggle] = useState(false)
    const handelDepartmentToggle = () => {
        setDepartmentToggle(!departmentToggle)
    }
    // filter by status
    const userStatus = [
        USER_STATUS.ACTIVE,
        USER_STATUS.DISABLE,
        USER_STATUS.PENDING,
        USER_STATUS.SHOW_ALL
    ]
    const [filterByStatus, setFilterByStatus] = useState('');
    const handelFilterByStatus = (event) => {
        setFilterByStatus(event.target.value);
    }
    const [statusToggle, setStatusToggle] = useState(false)
    const handelStatusToggle = () => {
        setStatusToggle(!statusToggle)
    }
    // search input field
    const [searchTerm, setSearchTerm] = useState('');
    const handelSearch = (event) => {
        setSearchTerm(event.target.value);
    };
    // combine filter search and sort
    const filterAndSearchData = data?.filter((item) => {
        // filter
        const statusMatch = filterByStatus ? item.status.includes(filterByStatus) : true;
        const DepartmentMatch = filterByDepartment ? item.departmentName.includes(filterByDepartment) : true;
        // search 
        const searchMatch = searchTerm === '' ||
            item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
            String(item.specialization).toLowerCase().includes(searchTerm.toLowerCase()) ||
            String(item.address).toLowerCase().includes(searchTerm.toLowerCase());
        return statusMatch && DepartmentMatch && searchMatch;
    })
    //pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [dataPerPage, setDataPerPage] = useState(5);
    const indexOfLastData = currentPage * dataPerPage;
    const indexOfFirstData = indexOfLastData - dataPerPage;
    const currentData = filterAndSearchData?.slice(indexOfFirstData, indexOfLastData)
    const handelPaginate = (pageNumber) => {
        setCurrentPage(pageNumber)
    }
    // delete
    const [modal, setModal] = useState(false)
    const toggleModal = (id) => {
        setModal(!modal)
        Cookies.set('delete_item', id);
    }
    const closeModal = () => {
        setModal(!modal)
        Cookies.remove('delete_item')
    }
    // update status
    const [statusMap, setStatusMap] = useState({});
    const handleStatusChange = async (event, userId) => {
        try {
            const { value } = event.target;
            setStatusMap(prevStatusMap => ({
                ...prevStatusMap,
                [userId]: value
            }));
            const updatedStatus = statusMap[userId];
            const data = {
                'userId': userId,
                'status': updatedStatus
            }
            setLoading(true)
            const response = await axios.post(`${config.api}/administrator/doctor/update/status`, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setLoading(false)
            if (response.data.status) {
                await fetchData()
                toast.success("status update successfully!")
            }
        } catch (error) {
            console.log(error)
            setLoading(false)
            toast.error("internal server error!")
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
            setLoading(false);
            toast.success("doctor deleted successfully!")
            await fetchData()
        } catch (error) {
            setLoading(false)
            toast.error("internal server error!")
        }
    }
    return (
        <div className={`row py-4 ${styles.listArea}`}>
            {loading ? (
                <div className={styles.loadingArea}>
                    <FadeLoader color='#d3d3d3' size="16" />
                </div>
            ) : (
                <>
                    <div>
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
                                <div className={styles.filterArea}>
                                    <button className='text-uppercase' onClick={handelStatusToggle}>
                                        <span>Status</span>
                                        <div>
                                            {/* <span className='me-2'>
                                                {
                                                    filterByStatus === '' ? 'show all' : filterByStatus.split('-').join(' ')
                                                }
                                            </span> */}
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
                                        {userStatus.map((status, index) => (
                                            <div key={index}>
                                                <label htmlFor={`status_${index}`} className={styles.radioArea}>
                                                    <input
                                                        className={`${styles.radioInput}`}
                                                        type="radio"
                                                        name="status"
                                                        id={`status_${index}`}
                                                        value={status === USER_STATUS.SHOW_ALL ? '' : status}
                                                        onChange={handelFilterByStatus}
                                                    />
                                                    {status}
                                                </label>
                                            </div>
                                        ))}
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
                                    <div className={`${departmentToggle ? styles.show : styles.hide}`}>
                                        {department?.map((name, index) => (
                                            <div key={index}>
                                                <label htmlFor={`name_${index}`} className={styles.radioArea}>
                                                    <input
                                                        className={`${styles.radioInput}`}
                                                        type="radio"
                                                        name="name"
                                                        id={`name_${index}`}
                                                        value={name === USER_STATUS.SHOW_ALL ? '' : name}
                                                        onChange={handelFilterByDepartment}
                                                    />
                                                    {name}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className={`${styles.searchArea}`}>
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={handelSearch}
                                        placeholder={`search for doctors`}
                                        className={`form-control ${styles.searchBox}`} />
                                </div>
                            </div>
                        </div>
                        <div className="list-area">
                            {
                                currentData?.length === 0 ?
                                    <div className={styles.notFound}>
                                        <h6 className='fw-bold'>no doctor found.</h6>
                                    </div>
                                    : <div className='p-3 mt-3 table-area'>
                                        <Table striped hover responsive>
                                            <thead className='p-3'>
                                                <tr>
                                                    <th>#</th>
                                                    <th>USER ID</th>
                                                    <th>DOCTOR ID</th>
                                                    <th>NAME</th>
                                                    <th>EMAIL</th>
                                                    <th>PHONE</th>
                                                    <th>Department</th>
                                                    <th className='text-center'>STATUS</th>
                                                    <th className='text-center'>ACTION</th>
                                                </tr>
                                            </thead>
                                            <tbody className='p-3'>
                                                {
                                                    currentData?.map((data, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td>{index + 1}</td>
                                                                <td className='text-center'>{data.userId}</td>
                                                                <td className='text-center'>{data.doctorId}</td>
                                                                <td>{data.name}</td>
                                                                <td>{data.email}</td>
                                                                <td>{data.phone}</td>
                                                                <td>{data.departmentName}</td>
                                                                <td className='text-center'>
                                                                    <select
                                                                        className="status-select form-select fw-bold"
                                                                        value={statusMap[data.userId] || data.status}
                                                                        onChange={(event) => handleStatusChange(event, data.userId)}
                                                                        style={{ cursor: "pointer" }}>
                                                                        {Object.entries(USER_STATUS)
                                                                            .filter(([key, value]) => value !== USER_STATUS.SHOW_ALL)
                                                                            .map(([key, value]) => (
                                                                                <option key={key} value={value}>
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
                                        {/* pagination */}
                                        <div className={`${styles.pagination}`} style={{ marginTop: "0px" }}>
                                            {
                                                currentData?.length > 0 ?
                                                    <Pagination data={filterAndSearchData}
                                                        dataPerPage={dataPerPage}
                                                        currentPage={currentPage}
                                                        handelPaginate={handelPaginate} />
                                                    : null
                                            }
                                        </div>
                                    </div>
                            }
                        </div>
                    </div>
                    {deleteModal ? (
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
                    ) : null}
                </>
            )}
        </div>
    );
};

export default DoctorList;
