import Breadcrumb from '@/components/breadcrumb';
import AdministratorLayout from '@/layouts/administrator/AdministratorLayout';
import axios from 'axios';
import Cookies from 'js-cookie';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { config } from '@/config';
import styles from "@/styles/administrator/List.module.css"
import { FadeLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { errorHandler } from '@/helpers/errorHandler';


const AdministratorSettings = () => {
    const token = Cookies.get('token');
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState(null);
    const [formData, setFormData] = useState({
        organization_name: '',
        address: '',
        email: '',
        phone: '',
        errors: []
    })
    const fetchSiteInfo = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`${config.api}/administrator/setting/info`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setLoading(false)
            setData(response.data.data)
            setFormData(response.data.data[0])
        }
        catch (error) {
            setLoading(false)
            return errorHandler({ error, toast })
        }
    }
    useEffect(() => {
        fetchSiteInfo()
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

    const formSubmit = async () => {
        try {
            setLoading(true)
            const data = {
                organization_name: formData.organization_name,
                address: formData.address,
                email: formData.email,
                phone: formData.phone
            }
            const res = await axios.post(`${config.api}/administrator/setting/info/update`, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log(res.data.data)
            setLoading(false)
            fetchSiteInfo()
            toast.success(res.data.message)
            console.log(formData)
        } catch (error) {
            setLoading(false)
            console.log(error)
            return errorHandler({ error, toast })
        }
    }
    return (
        <div>
            <Head>
                <title>settings</title>
            </Head>
            <Breadcrumb />
            <div className={`row py-3 px-2 ${styles.listArea}`}>
                {
                    loading ? (
                        <div className={styles.loadingArea}>
                            <FadeLoader color='#d3d3d3' size="16" />
                        </div>
                    ) : (
                        data ?
                            <div className="row">
                                {/* <pre>{JSON.stringify(formData, null, 2)}</pre> */}
                                <div className="col-md-6">
                                    <div className='my-4'>
                                        <label className='fw-bold my-2'>Organization Name</label>
                                        <input
                                            name="organization_name"
                                            onChange={handelInputChange}
                                            defaultValue={data[0]?.organization_name}
                                            type="text"
                                            placeholder='organization name'
                                            className='form-control' />
                                    </div>
                                    <div className='my-4'>
                                        <label className='fw-bold my-2'>Organization Address</label>
                                        <input
                                            name="address"
                                            onChange={handelInputChange}
                                            defaultValue={data[0]?.address}
                                            type="text"
                                            placeholder='organization address'
                                            className='form-control' />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className='my-4'>
                                        <label className='my-2 fw-bold'>Organization Phone</label>
                                        <input
                                            name="phone"
                                            onChange={handelInputChange}
                                            defaultValue={data[0]?.phone}
                                            type="text"
                                            placeholder='organization phone'
                                            className='form-control' />
                                    </div>
                                    <div className='my-4'>
                                        <label className='my-2 fw-bold'>Organization Email</label>
                                        <input
                                            name="email"
                                            onChange={handelInputChange}
                                            defaultValue={data[0]?.email}
                                            type="text"
                                            placeholder='organization email'
                                            className='form-control' />
                                    </div>
                                    <div className='d-flex justify-content-end'>
                                        <button onClick={formSubmit} className='px-4 btn btn-primary fw-bold'>save</button>
                                    </div>
                                </div>


                            </div>
                            : <div className={styles.notFound}>
                                <h6 className='fw-bold'>something went wrong!</h6>
                            </div>
                    )
                }
            </div >
        </div >
    );
};

export default AdministratorSettings;
AdministratorSettings.getLayout = function getLayout(page) {
    return <AdministratorLayout>{page}</AdministratorLayout>;
};


