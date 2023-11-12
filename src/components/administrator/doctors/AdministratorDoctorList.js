import React, { useState } from 'react';
import styles from "@/styles/administrator/doctorList.module.css"
import { USER_STATUS } from '@/constant';
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io"

const AdministratorDoctorList = () => {

    // filter by status
    const userStatus = [
        USER_STATUS.ACTIVE,
        USER_STATUS.IN_ACTIVE,
        USER_STATUS.DISABLE,
        USER_STATUS.PENDING,
        USER_STATUS.SHOW_ALL
    ]
    const [filterByStatus, setFilterByStatus] = useState('');
    const handelFilterByStatus = (event) => {
        setFilterByStatus(event.target.value);
    }
    const [statusToggle, setStatusToggle] = useState(true)
    const handelStatusToggle = () => {
        setStatusToggle(!statusToggle)
    }

    return (
        <div className='row py-4' style={{ minHeight: "80vh" }}>
            <div className="col-md-3">
                <div className={`${styles.filterHeader}`}>
                    <span className='text-uppercase'>Show</span>
                    <select
                        value=""
                        className={`${styles.customSelect} form-select`}
                    >
                        <option value="8">08</option>
                        <option value="12">12</option>
                        <option value="24">24</option>
                        <option value="36">36</option>
                        <option value="48">48</option>
                        <option value="96">96</option>
                    </select>
                </div>

                <div className={styles.filterArea}>
                    <button className='text-uppercase' onClick={handelStatusToggle}>Status
                        <div>
                            <span className={` ${statusToggle ? styles.show : styles.hide}`}>
                                <IoIosArrowUp size="15px" />
                            </span>
                            <span className={` ${statusToggle ? styles.hide : styles.show}`}>
                                <IoIosArrowDown size="15px" />
                            </span>
                        </div>
                    </button>
                    <div className={`${statusToggle ? styles.show : styles.hide}`}>
                        <hr />
                        {
                            userStatus.map((status, index) => (
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
                                        {status.split('-').join(' ')}
                                    </label>
                                </div>
                            ))
                        }
                    </div>
                </div>

                specialist
            </div>
            <div className="col-md-9">

            </div>
        </div>
    );
};

export default AdministratorDoctorList;