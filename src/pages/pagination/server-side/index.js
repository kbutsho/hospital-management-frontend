import { Table } from "react-bootstrap";
import { config } from "@/config";
import { useEffect, useState } from "react";
import { errorHandler } from "@/helpers/errorHandler";
import { USER_STATUS } from "@/constant";
import { AiFillDelete, AiFillEdit, AiFillEye, AiFillStar } from "react-icons/ai";
import { toast } from 'react-toastify';
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { removeProduct, storeProduct, totalItemsCount, updateProductStatus } from "@/redux/slice/productSlice";
import { Modal, ModalBody, ModalFooter } from "reactstrap";
import { RxCross2 } from "react-icons/rx";
import Link from "next/link";
import styles from "@/styles/administrator/List.module.css"
import Pagination from '@/helpers/pagination';
import { FadeLoader } from "react-spinners";


const ServerSide = () => {

    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true)
    const [addModal, setAddModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteItem, setDeleteItem] = useState('');
    const [formData, setFormData] = useState({
        file: null,
        errors: []
    })

    // server side pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [dataPerPage, setDataPerPage] = useState(10);
    const handelPaginate = (pageNumber) => {
        setCurrentPage(pageNumber)
    }

    // load data start
    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${config.api}/test`, {
                params: {
                    perPage: dataPerPage,
                    page: currentPage,
                },
            });
            dispatch(storeProduct(response.data.data));
            dispatch(totalItemsCount(response.data.total_items));
        } catch (error) {
            return errorHandler({ error, toast })
        } finally {
            setLoading(false)
        }
    };
    useEffect(() => {
        fetchData()
    }, [currentPage, dataPerPage])
    const reduxStoreProduct = useSelector(state => state.products.data);
    const totalItems = useSelector(state => state.products.totalItems);
    // load data end


    // status update start
    const handleStatusChange = async (event, id) => {
        try {
            const status = event.target.value;
            const data = {
                'status': status
            }
            setLoading(true)
            const response = await axios.patch(`${config.api}/test/${id}`, data);
            dispatch(updateProductStatus({ id, status }))
            toast.success(response.data.message)
        } catch (error) {
            return errorHandler({ error, toast })
        } finally {
            setLoading(false)
        }
    };
    // status update end

    // add data start
    const toggleAddModal = () => {
        setAddModal(!addModal)
    }
    const handleFileInputChange = (event) => {
        setFormData({
            ...formData,
            file: event.target.files[0],
            errors: {
                ...formData.errors,
                file: null
            }
        });
    };
    const formSubmit = async (event) => {
        event.preventDefault();
        try {
            setLoading(!loading);
            const formDataUpload = new FormData();
            formDataUpload.append('file', formData.file);
            const response = await axios.post(`${config.api}/test/add`, formDataUpload, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            setLoading(false);
            if (response.data.status) {
                setFormData({
                    file: null,
                    errors: []
                });
                setAddModal(false);
                fetchData();
                toast.success(response.data.message);
            }
        } catch (error) {
            return errorHandler({ error, toast, setFormData, formData })
        } finally {
            setLoading(false);
        }
    }
    // add data end

    // delete data start
    const toggleDeleteModal = (id) => {
        setDeleteModal(!deleteModal)
        setDeleteItem(id);
    }
    const handelDelete = async () => {
        try {
            setLoading(true)
            await axios.delete(`${config.api}/test/${deleteItem}`);
            fetchData();
            dispatch(removeProduct(deleteItem));
            toast.success("deleted successfully!")
        } catch (error) {
            return errorHandler({ error, toast })
        } finally {
            setLoading(false)
        }
    }
    // delete data end

    return (
        <div className='container py-5'>
            <div className='d-flex justify-content-between'>
                <div>
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
                <div className="d-flex justify-content-center align-items-center">
                    <button className="btn btn-success text-uppercase fw-bold">{totalItems} Logs</button>
                    <button className='text-uppercase btn btn-primary fw-bold mx-2 ' onClick={() => toggleAddModal()}>add logs</button>
                    <Link className='text-uppercase btn btn-danger fw-bold' href="/login">login</Link>
                </div>
            </div>
            {loading ?
                <div className="d-flex justify-content-center align-items-center"
                    style={{ height: "80vh", boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }}>
                    <div className={styles.loadingArea}>
                        <FadeLoader color='#d3d3d3' size="16" />
                    </div>
                </div> :
                <div>
                    {
                        reduxStoreProduct?.length > 0 ?
                            <div className="table-area my-3 px-4 py-3" >
                                <Table>
                                    <thead className="p-3">
                                        <tr>
                                            <th>ID</th>
                                            <th>REMOTE HOST</th>
                                            <th>TIMESTAMPS</th>
                                            <th>HTTP METHOD</th>
                                            <th>PROTOCOL VERSION</th>
                                            <th>STATUS CODE</th>
                                            <th>SEND BYTES</th>
                                            <th className="text-center">STATUS</th>
                                            <th className="text-center">ACTION</th>
                                        </tr>
                                    </thead>
                                    <tbody className='p-3'>
                                        {
                                            reduxStoreProduct?.map((data, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>{data?.id}</td>
                                                        <td>{data?.remote_host}</td>
                                                        <td>{data?.time_stamp}</td>
                                                        <td>{data?.http_method}</td>
                                                        <td>{data?.protocol_version}</td>
                                                        <td>{data?.http_status_code}</td>
                                                        <td>{data?.bytes_sent}</td>
                                                        <td className="text-center">
                                                            <select
                                                                className="status-select form-select fw-bold"
                                                                value={data?.status}
                                                                onChange={(event) => handleStatusChange(event, data?.id)}
                                                                style={{ color: data?.status === 'active' ? 'green' : 'red' }}>
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
                                                        <td>
                                                            <div className='d-flex justify-content-center'>
                                                                <button className='btn btn-primary btn-sm mx-1'><AiFillEye className='mb-1' /></button>
                                                                <button className='btn btn-success btn-sm mx-1'><AiFillEdit className='mb-1' /></button>
                                                                <button onClick={() => toggleDeleteModal(data?.id)} className='btn btn-danger btn-sm mx-1'><AiFillDelete className='mb-1' /></button>
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
                                        reduxStoreProduct?.length > 0 ?
                                            <Pagination totalItem={totalItems}
                                                dataPerPage={dataPerPage}
                                                currentPage={currentPage}
                                                handelPaginate={handelPaginate} />
                                            : null
                                    }
                                </div>
                            </div> :
                            <div className="d-flex justify-content-center align-items-center" style={{ height: "70vh" }}>
                                <h2>no data found</h2>
                            </div>
                    }
                </div>
            }
            {addModal ? (
                <div>
                    <Modal isOpen={addModal} className="modal-md">
                        <ModalBody>
                            <div className='p-3'>
                                <div className='d-flex justify-content-between align-items-center mb-3'>
                                    <h4 onClick={() => toggleAddModal()} className='fw-bold text-uppercase'>Add log file </h4>
                                    <RxCross2 size="24px" color='red' onClick={() => toggleAddModal()} style={{ cursor: "pointer" }} />
                                </div>
                                <form onSubmit={formSubmit}>
                                    <label className='mb-2'>
                                        <span className='fw-bold'>(.txt formate)</span>
                                        <AiFillStar className='required' />
                                    </label>
                                    <input
                                        type="file"
                                        name="file"
                                        onChange={handleFileInputChange}
                                        value={formData?.name}
                                        className='form-control' />
                                    <small className='validation-error'>
                                        {
                                            formData?.errors?.file ? formData?.errors?.file : null
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
                                <h6 className='fw-bold text-center'>are you sure want to delete?</h6>
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
        </div>
    );
};

export default ServerSide;
