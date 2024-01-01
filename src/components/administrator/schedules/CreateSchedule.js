import { useState } from "react";
import styles from "@/styles/administrator/List.module.css"
import { ImCross } from "react-icons/im";
import Select from 'react-select';
import { AiFillStar } from "react-icons/ai";
import { Table } from "react-bootstrap";
import { VscDiffAdded } from "react-icons/vsc";
import { MdOutlineRefresh } from "react-icons/md";
import Cookies from "js-cookie";
import { config } from "@/config";
import { useRouter } from "next/router";
import { errorHandler } from "@/helpers/errorHandler";
import axios from "axios";

const CreateSchedule = ({ data, error }) => {
    const router = useRouter();
    const token = Cookies.get('token');
    const [errorMessage, setErrorMessage] = useState(error);
    const [loading, setLoading] = useState(false)

    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const doctorOptions = data?.doctors.map((doctor, index) => ({
        value: doctor.id,
        label: doctor.name
    }));

    const [selectedChamber, setChamber] = useState(null);
    const chamberOptions = data?.chambers.map((chamber, index) => ({
        value: chamber.id,
        label: chamber.room
    }));

    const days = [
        { value: 'saturday', label: 'Saturday' },
        { value: 'sunday', label: 'Sunday' },
        { value: 'monday', label: 'Monday' },
        { value: 'tuesday', label: 'Tuesday' },
        { value: 'wednesday', label: 'Wednesday' },
        { value: 'thursday', label: 'Thursday' },
        { value: 'friday', label: 'Friday' },
    ];
    const [selectedDay, setSelectedDay] = useState(null)
    const [openingTime, setOpeningTime] = useState(null)
    const [closingTime, setClosingTime] = useState(null)

    const [schedule, setSchedule] = useState([]);
    const handleAddSchedule = () => {
        if (selectedDoctor && selectedChamber && selectedDay && openingTime && closingTime) {
            const newEntry = {
                doctor_id: selectedDoctor?.value,
                chamber_id: selectedChamber?.value,
                day: selectedDay?.value,
                opening_time: openingTime,
                closing_time: closingTime,
            };
            const entryExists = schedule.some(
                (entry) =>
                    entry.doctor_id === newEntry.doctor_id &&
                    entry.day === newEntry.day &&
                    entry.opening_time === newEntry.opening_time &&
                    entry.closing_time === newEntry.closing_time
            );
            if (!entryExists) {
                setErrorMessage(null)
                setSchedule([...schedule, newEntry]);
            } else {
                setErrorMessage("duplicate entry!");
            }
        } else {
            setErrorMessage("please select all required fields!");
        }
    };
    const [errorResponse, setErrorResponse] = useState([]);

    // console.log(errorResponse)
    // console.log(schedule)
    const formSubmit = async () => {
        try {
            setLoading(true);
            const data = {
                data: schedule
            }
            await axios.post(`${config.api}/administrator/schedule/create`, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setErrorMessage(null)
            router.push('/administrator/schedules')
            toast.success('schedule created successfully!')
        } catch (error) {
            if (error.response && error.response.data.error) {
                setErrorResponse(error.response.data.error);
            }
            return errorHandler({ error, setErrorMessage })
        } finally {
            setLoading(false)
        }
    }

    // handling error
    const isEqualSchedule = (scheduleA, scheduleB) => {
        return (
            scheduleA.doctor_id === scheduleB.doctor_id &&
            scheduleA.chamber_id === scheduleB.chamber_id &&
            scheduleA.day === scheduleB.day &&
            scheduleA.opening_time === scheduleB.opening_time &&
            scheduleA.closing_time === scheduleB.closing_time
        );
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

    const findDoctorName = (doctorId) => {
        const doctor = data?.doctors.find((doctor) => doctor.id === doctorId);
        return doctor ? doctor.name : 'unknown doctor';
    };
    const findChamberRoom = (chamberId) => {
        const chamber = data?.chambers.find((chamber) => chamber.id === chamberId);
        return chamber ? chamber.room : 'unknown room';
    };
    const convertTime = (time24) => {
        const [hours, minutes] = time24.split(':');
        let formattedTime = '';
        let suffix = hours >= 12 ? 'PM' : 'AM';
        let hours12 = hours % 12 || 12;
        formattedTime = `${hours12}:${minutes} ${suffix}`;
        return formattedTime;
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
                                    onClick={() => {
                                        setErrorMessage(null)
                                    }} />
                            </div>
                        </div>
                    ) : null
                )
            }
            <div className="row">
                <div className="col-md-6">
                    <label className='mb-2'>
                        <span className='fw-bold'>DOCTOR</span>
                        <AiFillStar className='required' />
                    </label>
                    <div className={`${styles.customSelectFilter}`}>
                        <Select
                            value={selectedDoctor}
                            onChange={(filterValue) => {
                                setSelectedDoctor(filterValue)
                            }}
                            options={doctorOptions}
                            isSearchable
                            placeholder="search or select doctor"
                            styles={customStyles}
                        />
                    </div>
                </div>
                <div className="col-md-6"
                    style={{
                        cursor: selectedDoctor === null
                            || selectedChamber === null
                            ? "not-allowed" : "pointer",
                    }}>
                    <label className='mb-2'>
                        <span className='fw-bold'>ROOM</span>
                        <AiFillStar className='required' />
                    </label>
                    <div className={`${styles.customSelectFilter}`}>
                        <Select
                            value={selectedChamber}
                            onChange={(filterValue) => {
                                setChamber(filterValue)
                            }}
                            isDisabled={selectedDoctor === null}
                            options={chamberOptions}
                            isSearchable
                            placeholder="search or select room"
                            styles={customStyles}
                        />
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-md-3">
                    <label className='mb-2'>
                        <span className='fw-bold'>OPENING TIME</span>
                        <AiFillStar className='required' />
                    </label>
                    <input
                        type="time"
                        value={openingTime}
                        onChange={(e) => {
                            setOpeningTime(e.target.value)
                        }}
                        disabled={
                            selectedDoctor === null
                            || selectedChamber === null
                        }
                        className={`form-select ${styles.timeInput}`}
                        style={{
                            cursor: selectedDoctor === null
                                || selectedChamber === null
                                ? "not-allowed" : "pointer",
                        }} />
                </div>
                <div className="col-md-3">
                    <label className='mb-2'>
                        <span className='fw-bold'>CLOSING TIME</span>
                        <AiFillStar className='required' />
                    </label>
                    <input
                        type="time"
                        value={closingTime}
                        onChange={(e) => {
                            setClosingTime(e.target.value)
                        }}
                        disabled={
                            selectedDoctor === null
                            || selectedChamber === null
                        }
                        className={`form-select ${styles.timeInput}`}
                        style={{
                            cursor: selectedDoctor === null
                                || selectedChamber === null
                                ? "not-allowed" : "pointer"
                        }} />
                </div>
                <div className="col-md-3"
                    style={{
                        cursor: selectedDoctor === null
                            || selectedChamber === null
                            ? "not-allowed" : "pointer",
                    }}>
                    <label className='mb-2'>
                        <span className='fw-bold'>DAY</span>
                        <AiFillStar className='required' />
                    </label>
                    <Select
                        value={selectedDay}
                        isDisabled={
                            selectedDoctor === null
                            || selectedChamber === null
                        }
                        options={days}
                        placeholder="select day"
                        onChange={(selectedOption) => {
                            setSelectedDay(selectedOption)
                        }}
                        styles={{
                            menu: (provided) => ({
                                ...provided,
                                maxHeight: '240px',
                                overflowY: 'auto',
                            }),
                            option: (provided) => ({
                                ...provided,
                                cursor: 'pointer',
                                padding: '4px 10px',
                            }),
                        }}
                    />
                </div>
                <div className="col-md-3"
                    style={{
                        cursor: selectedDoctor === null
                            || selectedChamber === null
                            ? "not-allowed" : "pointer"
                    }}>
                    <label className='mb-2'>
                        <span className='fw-bold'>ACTION</span>
                        <AiFillStar className='required' />
                    </label>
                    <div className={`d-flex justify-content-between ${styles.searchArea}`}>
                        <button
                            onClick={handleAddSchedule}
                            disabled={
                                selectedDoctor === null
                                || selectedChamber === null
                            }
                            className='btn py-1 btn-outline-secondary'
                            style={{ border: "none", "borderRadius": "4px 0px 0px 4px" }}>
                            <VscDiffAdded size="24px" />
                        </button>
                        <button
                            onClick={() => {
                                setSchedule(null)
                            }}
                            disabled={
                                selectedDoctor === null
                                || selectedChamber === null
                            }
                            className='btn py-1 btn-outline-secondary'
                            style={{ border: "none", "borderRadius": "0px 4px 4px 0px" }}>
                            <MdOutlineRefresh size="24px" />
                        </button>
                    </div>
                </div>
            </div>


            <div className="list-area">
                <div className='p-3 mt-3 table-area'>
                    <Table responsive bordered size="sm">
                        <thead className='p-3 custom-scrollbar'>
                            <tr>
                                <th className="text-center">SL</th>
                                <th className="text-center py-2">DOCTOR NAME</th>
                                <th className="text-center py-2">ROOM NO</th>
                                <th className="text-center py-2">DAY</th>
                                <th className="text-center py-2">SCHEDULE</th>
                                <th className="text-center py-2">ACTION</th>
                            </tr>
                        </thead>
                        {/* <tbody>
                            {schedule?.length > 0 && schedule?.map((schedule, index) => (
                                <tr key={index}>
                                    <td className='text-center pt-2'>
                                        {String(index + 1).padStart(2, '0')}
                                    </td>
                                    <td className="text-center">{findDoctorName(schedule.doctor_id)}</td>
                                    <td className="text-center">{findChamberRoom(schedule.chamber_id)}</td>
                                    <td className="text-center">{schedule.day}</td>
                                    <td className="text-center">{convertTime(schedule.opening_time)} - {convertTime(schedule.closing_time)}</td>

                                    <td className="text-center">
                                        <ImCross
                                            onClick={() => {
                                                setSchedule((prevSchedule) => {
                                                    const updatedSchedule = prevSchedule.filter((_, idx) => idx !== index);
                                                    return updatedSchedule;
                                                })
                                            }}
                                            size="14px"
                                            color="red"
                                            style={{ cursor: 'pointer' }} />
                                    </td>
                                </tr>
                            ))}
                        </tbody> */}
                        <tbody>
                            {schedule?.length > 0 && schedule?.map((scheduleItem, index) => {
                                const isError = errorResponse.some(errorItem =>
                                    isEqualSchedule(errorItem, scheduleItem)
                                );
                                const rowClassName = isError ? 'error-row' : '';
                                return (
                                    <tr key={index} className={rowClassName}>
                                        <td className='text-center pt-2'>
                                            {String(index + 1).padStart(2, '0')}
                                        </td>
                                        <td className="text-center">{findDoctorName(scheduleItem.doctor_id)}</td>
                                        <td className="text-center">{findChamberRoom(scheduleItem.chamber_id)}</td>
                                        <td className="text-center">{scheduleItem.day}</td>
                                        <td className="text-center">{convertTime(scheduleItem.opening_time)} - {convertTime(scheduleItem.closing_time)}</td>

                                        <td className="text-center">
                                            <ImCross
                                                onClick={() => {
                                                    setErrorResponse((prevSchedule) => {
                                                        const updatedSchedule = prevSchedule.filter((_, idx) => idx !== index);
                                                        return updatedSchedule;
                                                    })
                                                    setSchedule((prevSchedule) => {
                                                        const updatedSchedule = prevSchedule.filter((_, idx) => idx !== index);
                                                        return updatedSchedule;
                                                    })
                                                }}
                                                size="14px"
                                                color="red"
                                                style={{ cursor: 'pointer' }} />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>

                    </Table>
                    {
                        schedule?.length > 0 ?
                            <div className="d-flex justify-content-end">
                                <div
                                    style={{
                                        cursor: loading ? "not-allowed" : ""
                                    }}>
                                    <button
                                        disabled={loading}
                                        onClick={formSubmit}
                                        className="btn fw-bold btn-secondary"
                                        style={{ border: "none", "borderRadius": "4px", width: "120px" }}>
                                        {loading ? 'submitting...' : 'submit'}
                                    </button>
                                </div>
                            </div> : null
                    }
                </div>
            </div>
        </div>
    );
};

export default CreateSchedule;