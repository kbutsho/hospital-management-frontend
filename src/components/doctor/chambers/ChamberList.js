import React, { useCallback, useEffect, useState } from 'react';
import styles from "@/styles/administrator/List.module.css"
import { config } from "@/config/index";
import Cookies from 'js-cookie';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FadeLoader } from 'react-spinners';
import { AiFillDelete, AiFillEdit, AiFillEye, AiFillStar } from 'react-icons/ai';
import Pagination from '@/helpers/pagination';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import { RxCross2 } from "react-icons/rx";
import { Table } from 'react-bootstrap';
import { errorHandler } from '@/helpers/errorHandler';


const ChamberList = () => {
    const token = Cookies.get('token');
    const [loading, setLoading] = useState(true);
    const [addModal, setAddModal] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)
    const [updateModal, setUpdateModal] = useState(false)
    const [data, setData] = useState(null);
    const [deleteItem, setDeleteItem] = useState({
        id: '',
        address: ''
    })
    // const [updateItem, setUpdateItem] = useState({
    //     id: '',
    //     address: '',
    //     errors: []
    // })
    const [formData, setFormData] = useState({
        id: '',
        address: '',
        errors: []
    })
    // start fetch 
    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${config.api}/doctor/chamber/all`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setLoading(false);
            setData(response.data.data);
        } catch (error) {
            setLoading(false);
            return errorHandler({ error, toast })
        }
    }
    useEffect(() => {
        fetchData()
    }, [])
    // end fetch
    // search input field
    const [searchTerm, setSearchTerm] = useState('');
    const handelSearch = (event) => {
        setSearchTerm(event.target.value);
    };
    const filterAndSearchData = data?.filter((item) => {
        const searchMatch = searchTerm === '' ||
            item.address.toLowerCase().includes(searchTerm.toLowerCase());
        return searchMatch;
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
    // end pagination
    // start add 
    const toggleAddModal = () => {
        setAddModal(!addModal)
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
    const formSubmit = async (event) => {
        event.preventDefault();
        try {
            setLoading(!loading);
            const data = {
                address: formData?.address
            }
            const response = await axios.post(`${config.api}/doctor/chamber/create`, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setLoading(false);
            if (response.data.status) {
                setFormData({
                    id: '',
                    address: '',
                    errors: []
                });
                setAddModal(false);
                await fetchData();
                toast.success(response.data.message);
            }
        } catch (error) {
            setLoading(false);
            return errorHandler({ error, toast, setFormData, formData })
        }
    }
    // end add
    // start delete
    const toggleDeleteModal = (id, address) => {
        setDeleteModal(!deleteModal)
        setDeleteItem({ address: address, id: id });
    }
    const handelDelete = async () => {
        try {
            setLoading(true)
            await axios.delete(`${config.api}/doctor/chamber/${deleteItem?.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setLoading(false);
            toast.success("department deleted successfully!")
            await fetchData()
        } catch (error) {
            setLoading(false)
            return errorHandler({ error, toast })
        }
    }
    // end delete
    // start update
    const toggleUpdateModal = (id, address) => {
        setUpdateModal(!updateModal)
        setFormData({
            'id': id,
            'address': address
        })
    }
    const handelUpdate = async () => {
        try {
            setLoading(true)
            const data = {
                address: formData?.address
            }
            const response = await axios.patch(`${config.api}/doctor/chamber/${formData?.id}`, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setLoading(false);
            setUpdateModal(false);
            setFormData({
                'id': '',
                'address': '',
                'errors': []
            })
            toast.success(response.data.message)
            await fetchData()
        } catch (error) {
            setLoading(false)
            return errorHandler({ error, toast, setFormData, formData })
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
                            <div className="col-lg-3 col-12">
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
                            <div className="col-lg-8 col-12">
                                <div className={`${styles.searchArea}`}>
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={handelSearch}
                                        placeholder={`search here`}
                                        className={`form-control ${styles.searchBox}`} />
                                </div>
                            </div>
                            <div className="col-lg-1 col-12">
                                <button onClick={toggleAddModal} className={`  btn btn-outline-secondary  ${styles.addBtn}`}>Add </button>
                            </div>
                        </div>
                        <div className="list-area">
                            {
                                currentData?.length === 0 ?
                                    <div className={styles.notFound}>
                                        <h6 className='fw-bold'>no chamber found.</h6>
                                    </div>
                                    : <div className='p-3 mt-3 table-area'>
                                        <Table striped hover responsive>
                                            <thead className='p-3'>
                                                <tr>
                                                    <th>#</th>
                                                    <th>USER ID</th>
                                                    <th>DOCTOR ID</th>
                                                    <th>ADDRESS</th>
                                                    <th>Assistant</th>
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
                                                                <td>{data.user_id}</td>
                                                                <td>{data.doctor_id}</td>
                                                                <td>{data.address}</td>
                                                                <td className='text-danger fw-bold'>coming soon</td>
                                                                <td className='text-center'>{data.status}</td>
                                                                <td >
                                                                    <div className='d-flex justify-content-center'>
                                                                        <button className='btn btn-primary btn-sm mx-1'><AiFillEye className='mb-1' /></button>
                                                                        <button onClick={() => toggleUpdateModal(data.id, data.address)} className='btn btn-success btn-sm mx-1'><AiFillEdit className='mb-1' /></button>
                                                                        <button onClick={() => toggleDeleteModal(data.id, data.address)} className='btn btn-danger btn-sm mx-1'><AiFillDelete className='mb-1' /></button>
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
                    {addModal ? (
                        <div>
                            <Modal isOpen={addModal} className="modal-md">
                                <ModalBody>
                                    <div className='p-3'>
                                        <div className='d-flex justify-content-between align-items-center mb-3'>
                                            <h4 onClick={() => toggleAddModal()} className='fw-bold text-uppercase'>Add Chamber</h4>
                                            <RxCross2 size="24px" color='red' onClick={() => toggleAddModal()} style={{ cursor: "pointer" }} />
                                        </div>
                                        <form onSubmit={formSubmit}>
                                            <label className='mb-2'>
                                                <span className='fw-bold'>chamber address/room</span>
                                                <AiFillStar className='required' />
                                            </label>
                                            <input
                                                type="text"
                                                name="address"
                                                onChange={handelInputChange}
                                                value={formData?.address}
                                                className='form-control' />
                                            <small className='validation-error'>
                                                {
                                                    formData?.errors?.address ? formData?.errors?.address : null
                                                }
                                            </small>
                                            <input type="submit" value="submit" className='btn btn-primary w-100 mt-3 fw-bold' />
                                        </form>
                                    </div>
                                </ModalBody>
                            </Modal>
                        </div>
                    ) : null}
                    {deleteModal ? (
                        <div>
                            <Modal isOpen={deleteModal} className="modal-md" onClick={toggleDeleteModal}>
                                <ModalBody>
                                    <div className='p-3'>
                                        <h6 className='fw-bold text-center'>are you sure want to delete <span className='text-primary'>{deleteItem?.address ?? null}'s</span> chamber?</h6>
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
                    {updateModal ? (
                        <div>
                            <Modal isOpen={updateModal} className="modal-md">
                                <ModalBody>
                                    <div className='p-3'>
                                        <div className='d-flex justify-content-between align-items-center mb-3'>
                                            <h4 onClick={() => toggleAddModal()} className='fw-bold text-uppercase'>Update Chamber Information</h4>
                                            <RxCross2 size="24px" color='red' onClick={toggleUpdateModal} style={{ cursor: "pointer" }} />
                                        </div>
                                        <form onSubmit={handelUpdate}>
                                            <label className='mb-2'>
                                                <span className='fw-bold'>chamber address/room</span>
                                                <AiFillStar className='required' />
                                            </label>
                                            <input
                                                type="text"
                                                name="address"
                                                onChange={handelInputChange}
                                                value={formData?.address}
                                                className='form-control' />
                                            <small className='validation-error'>
                                                {
                                                    formData?.errors?.address ? formData?.errors?.address : null
                                                }
                                            </small>
                                            <p className='py-3'>remove / add assistant <span className='fw-bold'>(coming soon)</span></p>
                                            <input type="submit" value="submit" className='btn btn-primary w-100 mt-3 fw-bold' />
                                        </form>
                                    </div>
                                </ModalBody>
                            </Modal>
                        </div>
                    ) : null}
                </>
            )}
        </div>
    );
};

export default ChamberList;
