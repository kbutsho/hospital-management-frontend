import React, { useEffect, useState } from 'react';
import styles from "@/styles/administrator/List.module.css"
import { DAY, STATUS } from '@/constant';
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
import Select from 'react-select';
import { VscDiffAdded } from 'react-icons/vsc';
import {
    storeSchedule,
    totalItemsCount,
    fetchedItemsCount,
    removeSchedule,
    updateScheduleStatus
} from '@/redux/slice/administrator/scheduleSlice';
import { useRouter } from 'next/router';


const ScheduleList = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const token = Cookies.get('token');
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);

    const [dataPerPage, setDataPerPage] = useState(10); // show data per page
    const [currentPage, setCurrentPage] = useState(1);  // pagination by page

    const [filterByStatus, setFilterByStatus] = useState(null); // filter by status
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

    const [filterByDay, setFilterByDay] = useState(null); // filter by day
    const dayList = [
        DAY.SHOW_ALL,
        DAY.SATURDAY,
        DAY.SUNDAY,
        DAY.MONDAY,
        DAY.TUESDAY,
        DAY.WEDNESDAY,
        DAY.THURSDAY,
        DAY.FRIDAY,
    ]
    const dayOptions = dayList.map((day, index) => ({
        value: day,
        label: day
    }));

    const [filterByTimeSlot, setFilterByTimeSlot] = useState(null); // filter by timeSlot
    const [timeSlots, setTimeSlots] = useState([]);
    useEffect(() => { // fetch all doctor
        const fetchTimeSlots = async () => {
            try {
                const response = await axios.get(`${config.api}/administrator/schedule/time-slots`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                // here my response is 
                const times = response.data.data.map((time) => time.time);
                // times.unshift("show all");
                setTimeSlots(times);
                setErrorMessage(null)
            } catch (error) {
                console.log(error)
                return errorHandler({ error, setErrorMessage })
            }
        }
        fetchTimeSlots();
    }, [])
    const formatTimes = (time) => {
        const [hours, minutes] = time.split(':');
        const timeObject = new Date();
        timeObject.setHours(hours, minutes);
        return timeObject.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };
    const timeSlotOptions = timeSlots?.map((time, index) => {
        const [startTime, endTime] = time.split(' - ');
        const formattedStartTime = formatTimes(startTime);
        const formattedEndTime = formatTimes(endTime);
        const formattedTimeSlot = `${formattedStartTime} - ${formattedEndTime}`
        return {
            value: time,
            label: formattedTimeSlot
        };
    });
    timeSlotOptions.unshift({
        value: 'show all',
        label: 'SHOW ALL SLOT'
    });


    const [filterByDoctor, setFilterByDoctor] = useState(null); // filter by doctor
    const [doctorNames, setDoctorNames] = useState([]);
    useEffect(() => { // fetch all doctor
        const fetchDoctor = async () => {
            try {
                const response = await axios.get(`${config.api}/doctor/all`);
                const doctorNames = response.data.data.map((doctor) => doctor.name);
                doctorNames.unshift("show all");
                setDoctorNames(doctorNames);
                setErrorMessage(null)
            } catch (error) {
                return errorHandler({ error, setErrorMessage })
            }
        }
        fetchDoctor();
    }, [])
    const doctorOptions = doctorNames.map((name, index) => ({
        value: name,
        label: index === 0 ? `${name.split(" ")[1]}` : `${name}`
    }));

    const [filterByRoom, setFilterByRoom] = useState(null); // filter by room
    const [roomNames, setRoomNames] = useState([]);
    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await axios.get(`${config.api}/room/all`);
                const roomNames = response.data.data.map((room) => room.room);
                roomNames.unshift("show all");
                setRoomNames(roomNames);
                setErrorMessage(null)
            } catch (error) {
                return errorHandler({ error, setErrorMessage })
            }
        }
        fetchRooms();
    }, [])
    const roomOptions = roomNames.map((room, index) => ({
        value: room,
        label: index === 0 ? `${room.split(" ")[1]} room` : `${room}`
    }));

    const [sortBy, setSortBy] = useState(''); // handel sort by
    const [sortOrder, setSortOrder] = useState('asc') // handel sort order
    const [activeSortBy, setActiveSortBy] = useState('');
    const handleSortOrderChange = (order, sortField) => {
        setActiveSortBy(sortField)
        setSortBy(sortField);
        setSortOrder(order);
    };

    // load data
    const fetchData = async () => {
        try {
            setLoading(true);
            const data = {

                sortBy: sortBy,
                sortOrder: sortOrder,
                page: currentPage,
                perPage: dataPerPage,
                searchTerm: searchTerm,

                day: filterByDay?.value === STATUS.SHOW_ALL ? '' : filterByDay?.value,
                room: filterByRoom?.value === STATUS.SHOW_ALL ? '' : filterByRoom?.value,
                status: filterByStatus?.value === STATUS.SHOW_ALL ? '' : filterByStatus?.value,
                doctor: filterByDoctor?.value === STATUS.SHOW_ALL ? '' : filterByDoctor?.value,
                timeSlot: filterByTimeSlot?.value === STATUS.SHOW_ALL ? '' : filterByTimeSlot?.value
            }
            const response = await axios.get(`${config.api}/administrator/schedule/all`, {
                params: data,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setErrorMessage(null)
            dispatch(storeSchedule(response.data.data))
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
    }, [currentPage, dataPerPage, filterByStatus, filterByTimeSlot, filterByDay, filterByRoom, filterByDoctor, sortOrder, sortBy])
    const reduxStoreSchedule = useSelector(state => state.administrator_schedules.data);
    // const totalItems = useSelector(state => state.administrator_schedules.totalItems);
    const fetchedItems = useSelector(state => state.administrator_schedules.fetchedItems);


    const handelSearchSubmit = async () => { // search field
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


    const [deleteModal, setDeleteModal] = useState(false) // delete
    const [deleteItem, setDeleteItem] = useState({
        id: '',
        name: ''
    })
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
            setFilterByDoctor(null)
            setFilterByStatus(null)
            setFilterByDay(null)
            setFilterByRoom(null)
            setFilterByTimeSlot(null)
            setActiveSortBy('')
            setSearchTerm('')
            setSortBy('')
            setSortOrder('asc')
            setDataPerPage(10)
            setCurrentPage(1)
            const response = await axios.get(`${config.api}/administrator/schedule/all`, {
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
    const createSchedule = () => {
        router.push('/administrator/schedules/create')
    }
    const convertTime = (time24) => {
        const [hours, minutes] = time24.split(':');
        let formattedTime = '';
        let suffix = hours >= 12 ? 'PM' : 'AM';
        let hours12 = hours % 12 || 12;
        formattedTime = `${hours12}:${minutes} ${suffix}`;
        return formattedTime;
    };

    const customStyles = {
        control: (provided) => ({
            ...provided,
            border: 'none',
            boxShadow: 'none',
            cursor: 'pointer',
        }),
        option: (provided) => ({
            ...provided,
            cursor: 'pointer',
            'textTransform': 'uppercase',
            fontSize: '12px',

        })
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
                <div className="col-md-2">
                    <div className={`${styles.customSelectFilter}`}>
                        <Select
                            onChange={(filterValue) =>
                                setFilterByStatus(filterValue)
                            }
                            value={filterByStatus}
                            options={statusOptions}
                            isSearchable
                            placeholder="select status"
                            styles={customStyles}
                        />
                    </div>
                </div>
                <div className="col-md-4">
                    <div className={`${styles.customSelectFilter}`}>
                        <Select
                            onChange={(filterValue) =>
                                setFilterByDay(filterValue)
                            }
                            value={filterByDay}
                            options={dayOptions}
                            isSearchable
                            placeholder="select or search day"
                            styles={customStyles}
                        />
                    </div>
                </div>
                <div className="col-md-4">
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
                <div className="col-md-4">
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
                <div className="col-md-4">
                    <div className={`${styles.customSelectFilter}`}>
                        <Select
                            onChange={(filterValue) => {
                                setFilterByRoom(filterValue)
                            }}
                            value={filterByRoom}
                            options={roomOptions}
                            isSearchable
                            placeholder="select or search room"
                            styles={customStyles}
                        />
                    </div>
                </div>
                <div className="col-md-4">
                    <div className={`input-group ${styles.searchArea}`}>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(event) => {
                                setSearchTerm(event.target.value)
                            }}
                            placeholder={`search for schedules`}
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
                            onClick={createSchedule}
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
                            reduxStoreSchedule.length > 0 ?
                                <div className='p-3 mt-3 table-area'>
                                    <Table responsive bordered size="sm">
                                        <thead className='p-3 custom-scrollbar'>
                                            <tr>
                                                <th>#</th>
                                                <th className='text-center'>
                                                    <SortingArrow
                                                        level={`SCHEDULE ID`}
                                                        sortBy={`schedules.id`}
                                                        sortOrder={sortOrder}
                                                        activeSortBy={activeSortBy}
                                                        handleSortOrderChange={handleSortOrderChange} />
                                                </th>
                                                <th className='text-center'>
                                                    <SortingArrow
                                                        level={`DOCTOR NAME`}
                                                        sortBy={`doctors.name`}
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
                                                <th>
                                                    <SortingArrow
                                                        level={`DAY`}
                                                        sortBy={`schedules.day`}
                                                        sortOrder={sortOrder}
                                                        activeSortBy={activeSortBy}
                                                        handleSortOrderChange={handleSortOrderChange} />
                                                </th>
                                                <th className='text-center' style={{ paddingBottom: "8px" }}>TIME SLOT</th>
                                                <th className='text-center'>
                                                    <SortingArrow
                                                        level={`STATUS`}
                                                        sortBy={`schedules.status`}
                                                        sortOrder={sortOrder}
                                                        activeSortBy={activeSortBy}
                                                        handleSortOrderChange={handleSortOrderChange} />
                                                </th>
                                                <th className='text-center' style={{ paddingBottom: "8px" }}>ACTION</th>
                                            </tr>
                                        </thead>
                                        <tbody className='p-3'>
                                            {
                                                reduxStoreSchedule.map((data, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td className='text-center table-element'>{index + 1}</td>
                                                            <td className='text-center table-element'>{String(data.scheduleId).padStart(5, '0')}</td>
                                                            <td className='text-center table-element'>{data.doctorName}</td>
                                                            <td className='text-center table-element'>{data.room}</td>
                                                            <td className='table-element'>{data.day}</td>
                                                            <td className='text-center table-element'>{convertTime(data.openingTime)} - {convertTime(data.closingTime)}</td>
                                                            <td className='text-center'>
                                                                <select
                                                                    className="status-select form-select fw-bold"
                                                                    value={data.scheduleStatus}
                                                                    onChange={(event) => handleStatusChange(event, data.scheduleId)}
                                                                    style={{
                                                                        color: statusColors[data.scheduleStatus] || 'inherit'
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
                                                            <td >
                                                                <div className='d-flex justify-content-center'>
                                                                    <button className='btn btn-primary btn-sm mx-1'><AiFillEye className='mb-1' /></button>
                                                                    <button className='btn btn-success btn-sm mx-1'><AiFillEdit className='mb-1' />
                                                                    </button>
                                                                    <button onClick={() => toggleDeleteModal(data.id, data.scheduleId)} className='btn btn-danger btn-sm mx-1'><AiFillDelete className='mb-1' /></button>
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
                                            reduxStoreSchedule.length > 0 ?
                                                <Pagination totalItem={fetchedItems}
                                                    dataPerPage={dataPerPage}
                                                    currentPage={currentPage}
                                                    handelPaginate={(pageNumber) => {
                                                        setCurrentPage(pageNumber)
                                                    }}
                                                />
                                                : null
                                        }
                                    </div>
                                </div> :
                                <div className={styles.notFound}>
                                    <h6 className='fw-bold'>no schedule found.</h6>
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

export default ScheduleList;




