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
import { fetchedItemsCount, removeChamber, storeChamber, totalItemsCount, updateChamberStatus } from '@/redux/slice/administrator/chamberSlice';
import Select from 'react-select';
import { VscDiffAdded } from "react-icons/vsc";
import { useRouter } from 'next/router';

const ChamberList = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const token = Cookies.get('token');
    const [loading, setLoading] = useState(false);
    const [found, setFound] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null);
    const [filterByStatus, setFilterByStatus] = useState(null);
    // const [filterByDoctor, setFilterByDoctor] = useState(null);
    const [activeSortBy, setActiveSortBy] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [sortOrder, setSortOrder] = useState('desc')
    // const [doctorNames, setDoctorNames] = useState([]);
    const [deleteModal, setDeleteModal] = useState(false)
    const [deleteItem, setDeleteItem] = useState({
        id: '',
        room: ''
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
            const data = {
                perPage: dataPerPage,
                page: currentPage,
                searchTerm: searchTerm,
                status: filterByStatus?.value === STATUS.SHOW_ALL ? '' : filterByStatus?.value,
                sortOrder: sortOrder,
                sortBy: sortBy,
                // doctor: filterByDoctor?.value === STATUS.SHOW_ALL ? '' : filterByDoctor?.value
            }
            const response = await axios.get(`${config.api}/administrator/chamber/all`, {
                params: data,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setErrorMessage(null)
            dispatch(storeChamber(response.data.data))
            dispatch(totalItemsCount(response.data.totalItems))
            dispatch(fetchedItemsCount(response.data.fetchedItems))
            setFound(true)
        } catch (error) {
            return errorHandler({ error, setErrorMessage })
        }
    };

    useEffect(() => {
        fetchData()
    }, [currentPage, dataPerPage, filterByStatus, sortOrder, sortBy])

    const reduxStoreChamber = useSelector(state => state.administrator_chambers.data);
    const totalItems = useSelector(state => state.administrator_chambers.totalItems);
    const fetchedItems = useSelector(state => state.administrator_chambers.fetchedItems);

    // load doctor
    // useEffect(() => {
    //     const fetchDoctor = async () => {
    //         try {
    //             const response = await axios.get(`${config.api}/doctor/all`);
    //             const doctorNames = response.data.data.map((doctor) => doctor.name);
    //             doctorNames.unshift("show all");
    //             setDoctorNames(doctorNames);
    //             setErrorMessage(null)
    //         } catch (error) {
    //             return errorHandler({ error, setErrorMessage })
    //         }
    //     }
    //     fetchDoctor();
    // }, [])

    // sort order
    const handleSortOrderChange = (order, sortField) => {
        setActiveSortBy(sortField)
        setSortBy(sortField);
        setSortOrder(order);
    };

    // filter by doctor
    // const doctorOptions = doctorNames.map((name, index) => ({
    //     value: name,
    //     label: index === 0 ? `${name.split(" ")[1]} doctor` : `${name}`
    // }));
    // const handelFilterByDoctor = (newValue) => {
    //     setFilterByDoctor(newValue);
    // }

    // filter by status
    const userStatus = [
        STATUS.SHOW_ALL,
        STATUS.ACTIVE,
        STATUS.DISABLE,
        STATUS.PENDING
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
            // setLoading(true);
            await fetchData();
        } catch (error) {
            return errorHandler({ error, setErrorMessage })
        } finally {
            setSearchTerm('')
            // setLoading(false)
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
            await axios.post(`${config.api}/administrator/chamber/update/status`, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setErrorMessage(null)
            dispatch(updateChamberStatus({ id, status }))
        } catch (error) {
            return errorHandler({ error, setErrorMessage })
        }
    };

    // delete
    const toggleDeleteModal = (id, room) => {
        setDeleteModal(!deleteModal)
        setDeleteItem({ room: room ?? '', id: id ?? '' });
    }
    const handelDelete = async () => {
        try {
            await axios.delete(`${config.api}/administrator/chamber/${deleteItem?.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            dispatch(removeChamber(deleteItem?.id));
            toast.success("chamber deleted successfully!")
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
            setFilterByDoctor(null)
            setFilterByStatus(null)
            setActiveSortBy('')
            setSearchTerm('')
            setSortBy('')
            setSortOrder('desc')
            setDataPerPage(10)
            setCurrentPage(1)
            const response = await axios.get(`${config.api}/administrator/chamber/all`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response)
            setLoading(false)
            setErrorMessage(null)
            dispatch(storeChamber(response.data.data))
            dispatch(totalItemsCount(response.data.totalItems))
            dispatch(fetchedItemsCount(response.data.fetchedItems))
        } catch (error) {
            console.log(error)
            setLoading(false)
            return errorHandler({ error, setErrorMessage })
        }
    }
    const handelErrorMessage = () => {
        setErrorMessage(null)
    }

    // add chamber 
    const [addModal, setAddModal] = useState(false);
    const [addLoading, setAddLoading] = useState(false);
    const [formData, setFormData] = useState({
        room: '',
        errors: []
    })
    const toggleAddModal = () => {
        setAddModal(!addModal);
        setFormData({
            room: '',
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
    const chamberFormSubmit = async (e) => {
        e.preventDefault();
        try {
            setAddLoading(true)
            const data = {
                room: formData.room
            }
            const response = await axios.post(`${config.api}/administrator/chamber/create`, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.data.status) {
                setFormData({
                    room: '',
                    errors: []
                });
                await fetchData()
                setAddModal(!addModal);
                toast.success(response.data.message)
            }
        } catch (error) {
            return errorHandler({ error, toast, setFormData, formData })
        } finally {
            setAddLoading(false);
        }
    }

    const chamberDetails = (id) => {
        router.push(`/administrator/chambers/${id}`);
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
                            onChange={handelFilterByStatus}
                            options={userStatusOptions}
                            isSearchable
                            placeholder="search or select status"
                            styles={customStyles}
                        />
                    </div>
                </div>
                {/* <div className="col-md-3">
                    <div className={`${styles.customSelectFilter}`}>
                        <Select
                            value={filterByDoctor}
                            onChange={handelFilterByDoctor}
                            options={doctorOptions}
                            isSearchable
                            placeholder="search or select doctor"
                            styles={customStyles}
                        />
                    </div>
                </div> */}
                <div className="col-md-6">
                    <div className={`input-group ${styles.searchArea}`}>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handelSearch}
                            placeholder={`search for chambers`}
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
                            reduxStoreChamber.length > 0 ?
                                <div className='p-3 mt-3 table-area'>
                                    <Table hover responsive bordered size="sm">
                                        <thead className='p-3 custom-scrollbar'>
                                            <tr>
                                                <th className='text-center'>
                                                    <SortingArrow
                                                        level={`CHAMBER ID`}
                                                        sortBy={`chambers.id`}
                                                        sortOrder={sortOrder}
                                                        activeSortBy={activeSortBy}
                                                        handleSortOrderChange={handleSortOrderChange} />
                                                </th>
                                                <th>
                                                    <SortingArrow
                                                        level={`ROOM NUMBER`}
                                                        sortBy={`chambers.room`}
                                                        sortOrder={sortOrder}
                                                        activeSortBy={activeSortBy}
                                                        handleSortOrderChange={handleSortOrderChange} />
                                                </th>

                                                <th className='text-center'>
                                                    <SortingArrow
                                                        level={`STATUS`}
                                                        sortBy={`chambers.status`}
                                                        sortOrder={sortOrder}
                                                        activeSortBy={activeSortBy}
                                                        handleSortOrderChange={handleSortOrderChange} />
                                                </th>
                                                <th className='text-center'>ACTION</th>
                                            </tr>
                                        </thead>
                                        <tbody className='p-3'>
                                            {
                                                reduxStoreChamber.map((data, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td className='text-center table-element'>{String(data.id).padStart(5, '0')}</td>
                                                            <td className='text-center table-element'>{data.room}</td>
                                                            {/* <td>
                                                                <div className='d-flex justify-content-around align-items-center'>
                                                                    <h6 className='table-element fw-bold'>0</h6>
                                                                    <button
                                                                        style={{
                                                                            border: "0",
                                                                            cursor: data.activeDoctor == 0 ? 'not-allowed' : 'pointer',
                                                                            background: data.activeDoctor == 0 ? "#62AA89" : "auto"
                                                                        }}
                                                                        className='btn btn-primary btn-sm'>
                                                                        <AiFillEye className='mb-1' />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className='d-flex justify-content-around align-items-center'>
                                                                    <h6 className='table-element fw-bold'>0</h6>
                                                                    <button
                                                                        style={{
                                                                            border: "0",
                                                                            cursor: data.pendingDoctor == 0 ? 'not-allowed' : 'pointer',
                                                                            background: data.pendingDoctor == 0 ? "#62AA89" : "red"
                                                                        }}
                                                                        className='btn btn-primary btn-sm'>
                                                                        <AiFillEye className='mb-1' />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className='d-flex justify-content-around align-items-center'>
                                                                    <h6 className='table-element fw-bold'>0</h6>
                                                                    <button
                                                                        style={{
                                                                            border: "0",
                                                                            cursor: data.disableDoctor == 0 ? 'not-allowed' : 'pointer',
                                                                            background: data.disableDoctor == 0 ? "#62AA89" : "red"
                                                                        }}
                                                                        className='btn btn-primary btn-sm'>
                                                                        <AiFillEye className='mb-1' />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className='d-flex justify-content-around align-items-center'>
                                                                    <h6 className='table-element fw-bold'>0</h6>
                                                                    <button
                                                                        style={{
                                                                            border: "0",
                                                                            cursor: data.disableDoctor == 0 ? 'not-allowed' : 'pointer',
                                                                            background: data.disableDoctor == 0 ? "#62AA89" : "red"
                                                                        }}
                                                                        className='btn btn-primary btn-sm'>
                                                                        <AiFillEye className='mb-1' />
                                                                    </button>
                                                                </div>
                                                            </td> */}
                                                            <td className='text-center'>
                                                                <select
                                                                    className="status-select form-select fw-bold"
                                                                    value={data.status}
                                                                    onChange={(event) => handleStatusChange(event, data.id)}
                                                                    style={{
                                                                        color: statusColors[data.status] || 'inherit'
                                                                    }}
                                                                >
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
                                                            <td >
                                                                <div className='d-flex justify-content-center'>
                                                                    <button onClick={() => chamberDetails(data.id)} className='btn btn-primary btn-sm mx-1'><AiFillEye className='mb-1' /></button>
                                                                    <button className='btn btn-success btn-sm mx-1'><AiFillEdit className='mb-1' /></button>
                                                                    <button onClick={() => toggleDeleteModal(data.id, data.room)} className='btn btn-danger btn-sm mx-1'><AiFillDelete className='mb-1' /></button>
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
                                            reduxStoreChamber.length > 0 ?
                                                <div className="d-flex justify-content-end">
                                                    <div>
                                                        <Pagination totalItem={fetchedItems}
                                                            dataPerPage={dataPerPage}
                                                            currentPage={currentPage}
                                                            handelPaginate={handelPaginate} />
                                                        <div className='d-flex justify-content-end'
                                                            style={{ margin: "12px 6px 0 0", fontWeight: "bold", color: "#0B5ED7" }}>
                                                            showing {reduxStoreChamber.length} out of {totalItems}
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
                                    <h6 className='fw-bold text-center'>are you sure want to delete <span className='text-primary'>{deleteItem?.room ?? null}</span> room?</h6>
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
                                        <h4 className='text-uppercase fw-bold mb-4'>create chamber</h4>
                                        <ImCross size="24px"
                                            className='pt-2'
                                            style={{ cursor: "pointer", color: "red" }}
                                            onClick={toggleAddModal} />
                                    </div>
                                    <form onSubmit={chamberFormSubmit}>
                                        <label className='mb-3'>
                                            <span className='fw-bold'>ROOM NUMBER</span>
                                            <AiFillStar className='required' />
                                        </label>
                                        <input
                                            type="text"
                                            name="room"
                                            value={formData.room}
                                            onChange={handelInputChange}
                                            placeholder='write room number'
                                            className={`form-control ${formData.errors?.room ? 'is-invalid' : null}`} />
                                        <small className='validation-error'>
                                            {
                                                formData.errors?.room ? formData.errors?.room : null
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

export default ChamberList;




