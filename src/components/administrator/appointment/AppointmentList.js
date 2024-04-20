import React, { useEffect, useState } from 'react';
import styles from "@/styles/administrator/List.module.css"
import { APPOINTMENT_STATUS } from '@/constant';
import { config } from "@/config/index";
import Cookies from 'js-cookie';
import axios from 'axios';
import { toast } from 'react-toastify';
import { SyncLoader } from 'react-spinners';
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
import Select from 'react-select';
import DatePicker from "react-datepicker";
import { addMonths } from 'date-fns';
import "react-datepicker/dist/react-datepicker.css";
import { storeAppointment, fetchedItemsCount, totalItemsCount, resetAppointment, updateAppointmentStatus } from '@/redux/slice/administrator/appointmentSlice';



const AppointmentList = () => {
    const dispatch = useDispatch();
    const token = Cookies.get('token');
    const [loading, setLoading] = useState(false);
    const [found, setFound] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null);

    // sort by 
    const [activeSortBy, setActiveSortBy] = useState('');
    const [sortBy, setSortBy] = useState('');

    // sort order
    const [sortOrder, setSortOrder] = useState('desc')
    const handleSortOrderChange = (order, sortField) => {
        setActiveSortBy(sortField)
        setSortBy(sortField);
        setSortOrder(order);
    };

    const [deleteModal, setDeleteModal] = useState(false)
    const [deleteItem, setDeleteItem] = useState({ id: '', name: '' })

    // pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [dataPerPage, setDataPerPage] = useState(10);

    // filter by date
    const [selectedDate, setSelectedDate] = useState(null);
    const today = new Date();
    const twoMonthsLater = addMonths(today, 2);

    // filter by doctor
    const [filterByDoctor, setFilterByDoctor] = useState(null);
    const [doctor, setDoctor] = useState([]);
    const doctorOptions = doctor.map((doctor) => ({
        value: doctor.id, label: doctor.name
    }))

    // filter by schedule
    const [filterByTimeSlot, setFilterByTimeSlot] = useState(null);
    const [timeSlots, setTimeSlots] = useState([]);
    const formatTimes = (time) => {
        const [hours, minutes] = time.split(':');
        const timeObject = new Date();
        timeObject.setHours(hours, minutes);
        return timeObject.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };
    const timeSlotOptions = timeSlots?.map((time) => {
        const [startTime, endTime] = time.split(' - ');
        const formattedStartTime = formatTimes(startTime);
        const formattedEndTime = formatTimes(endTime);
        const formattedTimeSlot = `${formattedStartTime} - ${formattedEndTime}`
        return {
            value: time,
            label: formattedTimeSlot
        };
    });
    timeSlotOptions.unshift({ value: '', label: 'show all' })

    // filter by status
    const [filterByStatus, setFilterByStatus] = useState(null);
    const statusList = ['', APPOINTMENT_STATUS.PAID, APPOINTMENT_STATUS.IN_PROGRESS, APPOINTMENT_STATUS.CLOSED]
    const statusOptions = statusList.map((status, index) => ({
        value: status,
        label: index === 0 ? 'show all' : `${status} `
    }));

    // filter by department
    const [filterByDepartment, setFilterByDepartment] = useState(null);
    const [department, setDepartment] = useState([]);
    const departmentOptions = department.map((dept) => ({
        value: dept.id, label: dept.name
    }))

    // load doctor, department & schedule
    useEffect(() => {
        const fetchDoctorDepartmentSchedule = async () => {
            try {
                const response = await axios.get(`${config.api}/administrator/doctor-department-schedule`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setDoctor([{ id: '', name: 'show all' }, ...response.data.data.doctors])
                setDepartment([{ id: '', name: 'show all' }, ...response.data.data.departments])
                const times = response.data.data.schedule.map((time) => time.time)
                setTimeSlots(times)
                setErrorMessage(null)
            } catch (error) {
                return errorHandler({ error, setErrorMessage })
            }
        }
        fetchDoctorDepartmentSchedule()
    }, [])

    // load serial data
    const fetchData = async () => {
        try {
            const data = {
                perPage: dataPerPage,
                page: currentPage,
                searchTerm: searchTerm,
                sortOrder: sortOrder,
                sortBy: sortBy,
                date: selectedDate === null ? '' :
                    `${selectedDate.getFullYear()}-${selectedDate?.getMonth() + 1}-${selectedDate?.getDate()}`,
                status: filterByStatus === null ? '' : filterByStatus.value,
                doctor: filterByDoctor === null ? '' : filterByDoctor.value,
                schedule: filterByTimeSlot === null ? '' : filterByTimeSlot.value,
                department: filterByDepartment === null ? '' : filterByDepartment?.value
            }
            const response = await axios.get(`${config.api}/administrator/appointment/all`, {
                params: data,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setErrorMessage(null)
            dispatch(storeAppointment(response.data.data))
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
    }, [currentPage, dataPerPage, filterByStatus, filterByDoctor, filterByTimeSlot, filterByDepartment, selectedDate, sortOrder, sortBy])

    const reduxStoreAppointment = useSelector(state => state.administrator_appointments.data);
    const totalItems = useSelector(state => state.administrator_appointments.totalItems);
    const fetchedItems = useSelector(state => state.administrator_appointments.fetchedItems);

    // search 
    const [searchTerm, setSearchTerm] = useState('');
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
            const response = await axios.post(`${config.api}/administrator/appointment/update/status`, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log(response.data.data)
            setErrorMessage(null)
            // fetchData()
            dispatch(updateAppointmentStatus({ id, status }))
        } catch (error) {
            console.log(error)
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
            await axios.delete(`${config.api} /administrator/appointment/${deleteItem?.id} `, {
                headers: {
                    Authorization: `Bearer ${token} `
                }
            });
            dispatch(removeSerial(deleteItem?.id));
            toast.success("appointment deleted successfully!")
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
            setFilterByDoctor(null)
            setFilterByDepartment(null)
            setFilterByTimeSlot(null)
            setSelectedDate(null)
            setActiveSortBy('')
            setSearchTerm('')
            setSortBy('')
            setSortOrder('desc')
            setDataPerPage(10)
            setCurrentPage(1)
            dispatch(resetAppointment());
            const response = await axios.get(`${config.api}/administrator/appointment/all`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setLoading(false)
            setErrorMessage(null)
            dispatch(storeAppointment(response.data.data))
            dispatch(totalItemsCount(response.data.totalItems))
            dispatch(fetchedItemsCount(response.data.fetchedItems))
        } catch (error) {
            console.log(error)
            return errorHandler({ error, setErrorMessage })
        }
    }

    const handelErrorMessage = () => {
        setErrorMessage(null)
    }
    const convertTime = (time24) => {
        const [hours, minutes] = time24.split(':');
        let formattedTime = '';
        let suffix = hours >= 12 ? 'PM' : 'AM';
        let hours12 = hours % 12 || 12;
        if (hours12 < 10) {
            hours12 = String(hours12).padStart(2, '0')
        }
        formattedTime = `${hours12}:${minutes} ${suffix} `;
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
        [APPOINTMENT_STATUS.PAID]: 'blue',
        [APPOINTMENT_STATUS.IN_PROGRESS]: 'green',
        [APPOINTMENT_STATUS.CLOSED]: 'red'
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
                        <DatePicker
                            placeholderText="select date"
                            selected={selectedDate}
                            minDate={today}
                            maxDate={twoMonthsLater}
                            onChange={(date) => setSelectedDate(date)}
                            className={`form-control serial-date-picker ${selectedDate ? 'datePickerActive' : 'datePickerDisable'}`}
                        />
                    </div>
                </div>
                <div className="col-md-3">
                    <div className={`${styles.customSelectFilter}`}>
                        <Select
                            onChange={(filterValue) => {
                                setFilterByDoctor(filterValue)
                            }}
                            value={filterByDoctor}
                            options={doctorOptions}
                            isSearchable
                            placeholder="select or search doctor"
                            styles={customStyles}
                        />
                    </div>
                </div>
                <div className="col-md-3">
                    <div className={`${styles.customSelectFilter}`}>
                        <Select
                            onChange={(filterValue) => {
                                setFilterByTimeSlot(filterValue)
                            }}
                            value={filterByTimeSlot}
                            options={timeSlotOptions}
                            isSearchable
                            placeholder="search or select time slot"
                            styles={customStyles}
                        />
                    </div>
                </div>
            </div>
            <div className="row">
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
                <div className="col-md-3">
                    <div className={`${styles.customSelectFilter}`}>
                        <Select
                            onChange={(filterValue) => {
                                setFilterByDepartment(filterValue)
                            }}
                            value={filterByDepartment}
                            options={departmentOptions}
                            isSearchable
                            placeholder="select or search department"
                            styles={customStyles}
                        />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className={`input-group ${styles.searchArea}`}>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value)
                            }}
                            placeholder={`search for appointment`}
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
                        <SyncLoader color='#d3d3d3' size="12" />
                    </div> :
                    <div className="list-area">
                        {
                            reduxStoreAppointment.length > 0 ?
                                <div className='p-3 mt-3 table-area'>
                                    <Table responsive bordered size="sm" style={{ fontSize: "13px" }}>
                                        <thead className='p-3 custom-scrollbar'>
                                            <tr>
                                                <th className='text-center'>
                                                    <SortingArrow
                                                        level={`ID`}
                                                        sortBy={`appointments.id`}
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
                                                        level={`DEPT`}
                                                        sortBy={`departments.name`}
                                                        sortOrder={sortOrder}
                                                        activeSortBy={activeSortBy}
                                                        handleSortOrderChange={handleSortOrderChange} />
                                                </th>
                                                <th className='text-center'>
                                                    <SortingArrow
                                                        level={`DOCTOR`}
                                                        sortBy={`doctors.name`}
                                                        sortOrder={sortOrder}
                                                        activeSortBy={activeSortBy}
                                                        handleSortOrderChange={handleSortOrderChange} />
                                                </th>
                                                <th className='text-center' style={{ paddingBottom: "8px" }}>SCHEDULE</th>
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
                                                        sortBy={`appointments.status`}
                                                        sortOrder={sortOrder}
                                                        activeSortBy={activeSortBy}
                                                        handleSortOrderChange={handleSortOrderChange} />
                                                </th>
                                                <th className='text-center'>ACTION</th>
                                            </tr>
                                        </thead>
                                        <tbody className='p-3'>
                                            {
                                                reduxStoreAppointment.map((data, index) => {
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
                                                                    value={data.status}
                                                                    onChange={(event) => handleStatusChange(event, data.id)}
                                                                    style={{
                                                                        color: statusColors[data.status] || 'inherit'
                                                                    }}>
                                                                    {Object.entries(APPOINTMENT_STATUS)
                                                                        .filter(([key, value]) => value !== APPOINTMENT_STATUS.SHOW_ALL)
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
                                                                    {/* <button style={{ border: "0" }} className='btn btn-primary btn-sm mx-1'><AiFillEye className='mb-1' /></button>
                                                                    <button style={{ border: "0" }} className='btn btn-success btn-sm mx-1'><AiFillEdit className='mb-1' /></button> */}
                                                                    <button style={{ border: "0" }} onClick={() => toggleDeleteModal(data.id, data.name)} className='btn btn-danger btn-sm mx-1'><AiFillDelete className='mb-1' /></button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </Table>
                                    <div className={`${styles.pagination} `} style={{ marginTop: "0px" }}>
                                        {
                                            reduxStoreAppointment.length > 0 ?
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
                                                            showing {reduxStoreAppointment.length} out of {fetchedItems}
                                                        </div>
                                                    </div>
                                                </div>
                                                : null
                                        }
                                    </div>
                                </div> :
                                (
                                    found ? <div className={styles.notFound}>
                                        <h6 className='fw-bold'>no appointment found.</h6>
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
                                    <h6 className='fw-bold text-center'>are you sure want to delete <span className='text-primary'>{deleteItem?.name ?? null}</span>'s appointment?</h6>
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
        </div>
    );
};

export default AppointmentList;




