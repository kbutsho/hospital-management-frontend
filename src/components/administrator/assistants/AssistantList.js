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

const AssistantList = () => {
    const token = Cookies.get('token');
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState(false)
    const [data, setData] = useState();
    const [doctor, setDoctor] = useState([]);
    const [deleteItem, setDeleteItem] = useState({
        id: '',
        name: ''
    })
    console.log(setData)
    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${config.api}/administrator/assistant/all`, {
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
            return errorHandler({ error, toast })
        }
    };
    useEffect(() => {
        fetchData()
    }, []);

    useEffect(() => {
        const fetchDoctor = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${config.api}/administrator/doctor/all`);
                const doctorNames = response.data.data.map((doctor) => doctor.name);
                doctorNames.unshift("show all");
                setDoctor(doctorNames);
                setLoading(false);
            } catch (error) {
                setLoading(false)
                return errorHandler({ error, toast })
            }
        };
        fetchDoctor();
    }, []);

    // filter by doctor
    const [filterByDoctor, setFilterByDoctor] = useState('');
    const handelFilterByDoctor = (event) => {
        setFilterByDoctor(event.target.value);
    }
    const [doctorToggle, setDoctorToggle] = useState(false)
    const handelDoctorToggle = () => {
        setDoctorToggle(!doctorToggle)
    }
    // filter by status
    const userStatus = [
        USER_STATUS.SHOW_ALL,
        USER_STATUS.ACTIVE,
        USER_STATUS.DISABLE,
        USER_STATUS.PENDING
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
        const DoctorMatch = filterByDoctor ? item.doctorName.includes(filterByDoctor) : true;
        // search 
        const searchMatch = searchTerm === '' ||
            item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.chamberAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
            String(item.address).toLowerCase().includes(searchTerm.toLowerCase());
        return statusMatch && DoctorMatch && searchMatch;
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
    // update status
    const handleStatusChange = async (event, userId) => {
        try {
            const data = {
                'userId': userId,
                'status': event.target.value
            }
            setLoading(true)
            const response = await axios.post(`${config.api}/administrator/assistant/update/status`, data, {
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
            setLoading(false)
            return errorHandler({ error, toast })
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
            await axios.delete(`${config.api}/administrator/assistant/${deleteItem?.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setLoading(false);
            toast.success("assistant deleted successfully!")
            await fetchData()
        } catch (error) {
            setLoading(false)
            return errorHandler({ error, toast })
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
                                    <button className='text-uppercase' onClick={handelDoctorToggle}>
                                        <span>Doctor</span>
                                        <div>
                                            <span>
                                                {
                                                    doctorToggle ?
                                                        <IoIosArrowUp size="16px" className={styles.dropdownIcon} />
                                                        : <IoIosArrowDown size="16px" className={styles.dropdownIcon} />
                                                }
                                            </span>
                                        </div>
                                    </button>
                                    <div className={`${doctorToggle ? `${styles.show} ${styles.scrollable}` : styles.hide}`}>
                                        {doctor?.map((name, index) => (
                                            <div key={index}>
                                                <label htmlFor={`name_${index}`} className={styles.radioArea}>
                                                    <input
                                                        className={`${styles.radioInput}`}
                                                        type="radio"
                                                        name="name"
                                                        id={`name_${index}`}
                                                        value={name === USER_STATUS.SHOW_ALL ? '' : name}
                                                        onChange={handelFilterByDoctor}
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
                                        placeholder={`search for assistants`}
                                        className={`form-control ${styles.searchBox}`} />
                                </div>
                            </div>
                        </div>
                        <div className="list-area">
                            {
                                currentData?.length === 0 ?
                                    <div className={styles.notFound}>
                                        <h6 className='fw-bold'>no assistant found.</h6>
                                    </div>
                                    : <div className='p-3 mt-3 table-area'>
                                        <Table striped hover responsive>
                                            <thead className='p-3 custom-scrollbar'>
                                                <tr>
                                                    <th>#</th>
                                                    <th>USER ID</th>
                                                    <th>ASSISTANT ID</th>
                                                    <th>NAME</th>
                                                    <th>EMAIL</th>
                                                    <th>PHONE</th>
                                                    <th>ADDRESS</th>
                                                    <th>DOCTOR NAME</th>
                                                    <th >CHAMBER ADDRESS</th>
                                                    <th className='text-center' >STATUS</th>
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
                                                                <td className='text-center'>{data.assistantId}</td>
                                                                <td>{data.name}</td>
                                                                <td>{data.email}</td>
                                                                <td>{data.phone}</td>
                                                                <td>{data.address}</td>
                                                                <td >{data.doctorName}</td>
                                                                <td >{data.chamberAddress}</td>
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
                                                                                    <span >{value}</span>
                                                                                </option>
                                                                            ))}
                                                                    </select>
                                                                </td>
                                                                <td >
                                                                    <div className='d-flex justify-content-center'>
                                                                        <button className='btn btn-primary btn-sm mx-1'><AiFillEye className='mb-1' /></button>
                                                                        <button className='btn btn-success btn-sm mx-1'><AiFillEdit className='mb-1' /></button>
                                                                        <button onClick={() => toggleDeleteModal(data.assistantId, data.name)} className='btn btn-danger btn-sm mx-1'><AiFillDelete className='mb-1' /></button>
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
                                        <h6 className='fw-bold text-center'>are you sure want to delete <span className='text-primary'>{deleteItem?.name ?? null}</span> assistant?</h6>
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
            )
            }
        </div >
    );
};

export default AssistantList;
