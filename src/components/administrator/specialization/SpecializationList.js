import React, { useCallback, useEffect, useState } from 'react';
import styles from "@/styles/administrator/doctorList.module.css"
import { config } from "@/config/index";
import Cookies from 'js-cookie';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FadeLoader } from 'react-spinners';
import { AiFillDelete, AiFillEdit, AiFillEye } from 'react-icons/ai';
import { Table } from 'react-bootstrap';
import Pagination from '@/helpers/pagination';


const SpecializationList = () => {
    const [loading, setLoading] = useState(true);
    const token = Cookies.get('token');
    const [data, setData] = useState();
    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${config.api}/administrator/specialization/all`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setLoading(false);
            if (response.data.status) {
                setData(response.data.data);
            }
        } catch (error) {
            console.log(error)
            setLoading(false);
            if (error.response) {
                toast.error(error.response.data.error)
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

    // filter by status
    // search input field
    const [searchTerm, setSearchTerm] = useState('');
    const handelSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    // combine filter search and sort
    const filterAndSearchData = data?.filter((item) => {
        // filter

        // const brandMatch = filterByBrand ? item.brand.includes(filterByBrand) : true;
        // String(item.specialization).toLowerCase().includes(searchTerm.toLowerCase()) ||
        // search 
        const searchMatch = searchTerm === '' ||
            item.name.toLowerCase().includes(searchTerm.toLowerCase());
        return searchMatch;
    })
    // sort
    // .sort((itemA, itemB) => {
    //     if (sortOrder === PRICE_SORT_ORDER.MIN_TO_MAX) {
    //         return itemA.discountPrice - itemB.discountPrice;
    //     } else if (sortOrder === PRICE_SORT_ORDER.MAX_TO_MIN) {
    //         return itemB.discountPrice - itemA.discountPrice;
    //     }
    //     return 0;
    // });

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
    const handleDelete = async () => {
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
                            <div className="col-md-8">
                                <div className={`${styles.searchArea}`}>
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={handelSearch}
                                        placeholder={`search here`}
                                        className={`form-control ${styles.searchBox}`} />
                                </div>
                            </div>
                            <div className="col-md-1">
                                <button className='pb-2 fw-bold btn btn-outline-secondary w-100'>Add </button>
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
                                                    <th>ID</th>
                                                    <th>NAME</th>
                                                    <th className='text-center'>ACTION</th>
                                                </tr>
                                            </thead>
                                            <tbody className='p-3'>
                                                {
                                                    currentData?.map((data, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td>{index + 1}</td>
                                                                <td>{data.name}</td>
                                                                <td >
                                                                    <div className='d-flex justify-content-center'>
                                                                        <button className='btn btn-primary btn-sm mx-1'><AiFillEye className='mb-1' /></button>
                                                                        <button className='btn btn-success btn-sm mx-1'><AiFillEdit className='mb-1' /></button>
                                                                        <button onClick={() => toggleModal(data.id)} className='btn btn-danger btn-sm mx-1'><AiFillDelete className='mb-1' /></button>
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
                </>
            )}
        </div>
    );
};

export default SpecializationList;
