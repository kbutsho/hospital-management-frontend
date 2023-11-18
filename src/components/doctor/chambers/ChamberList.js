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

    // const [data, setData] = useState();
    // const [deleteItem, setDeleteItem] = useState({
    //     id: '',
    //     address: ''
    // })
    // const [updateItem, setUpdateItem] = useState({
    //     id: '',
    //     address: '',
    //     errors: []
    // })

    const [formData, setFormData] = useState({
        'id': '',
        address: '',
        errors: []
    })

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${config.api}/doctor/chambers/all`, {
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
    }
    useEffect(() => {
        fetchData()
    }, [])

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
    // add chamber
    const formSubmit = async (event) => {
        event.preventDefault();
        try {
            setLoading(!loading);
            const data = {
                address: formData?.name
            }
            const response = await axios.post(`${config.api}/administrator/department/create`, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setLoading(false);
            if (response.data.status) {
                setFormData({
                    name: '',
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
    // search input field
    const [searchTerm, setSearchTerm] = useState('');
    const handelSearch = (event) => {
        setSearchTerm(event.target.value);
    };
    const filterAndSearchData = data?.filter((item) => {
        const searchMatch = searchTerm === '' ||
            item.name.toLowerCase().includes(searchTerm.toLowerCase());
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
    const toggleAddModal = () => {
        setAddModal(!addModal)
    }
    // delete
    const toggleDeleteModal = (id, name) => {
        setDeleteModal(!deleteModal)
        setDeleteItem({ name: name ?? '', id: id ?? '' });
    }
    const handelDelete = async () => {
        try {
            setLoading(true)
            await axios.delete(`${config.api}/administrator/department/${deleteItem?.id}`, {
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
            // toast.error("internal server error!")
        }
    }
    // update
    const toggleUpdateModal = (id, name) => {
        setUpdateModal(!updateModal)
        setUpdateItem({ name: name ?? '', id: id ?? '' });
    }
    const handelUpdateChange = (event) => {
        setUpdateItem({
            ...updateItem,
            [event.target.name]: event.target.value,
            errors: {
                ...updateItem.errors,
                [event.target.name]: null
            }
        })
    };
    const handelUpdate = async () => {
        try {
            setLoading(true)
            const data = {
                name: updateItem.name
            }
            await axios.patch(`${config.api}/administrator/department/${updateItem?.id}`, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setLoading(false);
            setUpdateModal(false);
            toast.success("department updated successfully!")
            await fetchData()
        } catch (error) {
            setLoading(false)
            if (error.response) {
                const errorStatus = error.response.status;
                if (errorStatus === 422 || errorStatus === 409) {
                    setUpdateItem({
                        ...updateItem,
                        errors: error.response.data.error
                    });
                    toast.error(error.response.data.message)
                }
                else if (errorStatus === 401 || errorStatus === 500) {
                    toast.error(error.response.data.error)
                }
                else {
                    toast.error("unexpected error. try again later!");
                }
            }
            else if (error.isAxiosError) {
                toast.error("network error. try again later!");
            }
            else {
                toast.error("network error. try again later!");
            }
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
                                        <h6 className='fw-bold'>no data found.</h6>
                                    </div>
                                    : <div className='p-3 mt-3 table-area'>
                                        <Table striped hover responsive>
                                            <thead className='p-3'>
                                                <tr>
                                                    <th>#</th>
                                                    <th>DEPARTMENT ID</th>
                                                    <th>DEPARTMENT NAME</th>
                                                    <th className='text-center'>ACTION</th>
                                                </tr>
                                            </thead>
                                            <tbody className='p-3'>
                                                {
                                                    currentData?.map((data, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td>{index + 1}</td>
                                                                <td>{data.id}</td>
                                                                <td>{data.name}</td>
                                                                <td >
                                                                    <div className='d-flex justify-content-center'>
                                                                        <button className='btn btn-primary btn-sm mx-1'><AiFillEye className='mb-1' /></button>
                                                                        <button onClick={() => toggleUpdateModal(data.id, data.name)} className='btn btn-success btn-sm mx-1'><AiFillEdit className='mb-1' /></button>
                                                                        <button onClick={() => toggleDeleteModal(data.id, data.name)} className='btn btn-danger btn-sm mx-1'><AiFillDelete className='mb-1' /></button>
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
                                            <h4 onClick={() => toggleAddModal()} className='fw-bold text-uppercase'>Add Department</h4>
                                            <RxCross2 size="24px" color='red' onClick={() => toggleAddModal()} style={{ cursor: "pointer" }} />
                                        </div>
                                        <form onSubmit={formSubmit}>
                                            <label className='mb-2'>
                                                <span className='fw-bold'>Department Name</span>
                                                <AiFillStar className='required' />
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                onChange={handelInputChange}
                                                value={formData?.name}
                                                className='form-control' />
                                            <small className='validation-error'>
                                                {
                                                    formData?.errors?.name ? formData?.errors?.name : null
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
                                        <h6 className='fw-bold text-center'>are you sure want to delete <span className='text-primary'>{deleteItem?.name ?? null}</span> department?</h6>
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
                                            <h4 onClick={() => toggleAddModal()} className='fw-bold text-uppercase'>Update Department</h4>
                                            <RxCross2 size="24px" color='red' onClick={toggleUpdateModal} style={{ cursor: "pointer" }} />
                                        </div>
                                        <form onSubmit={handelUpdate}>
                                            <label className='mb-2'>
                                                <span className='fw-bold'>Department Name</span>
                                                <AiFillStar className='required' />
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                onChange={handelUpdateChange}
                                                value={updateItem?.name}
                                                className='form-control' />
                                            <small className='validation-error'>
                                                {
                                                    updateItem?.errors?.name ? updateItem?.errors?.name : null
                                                }
                                            </small>
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
