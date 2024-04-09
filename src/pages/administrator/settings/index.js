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
import { AiFillStar } from 'react-icons/ai';


const AdministratorSettings = () => {
    const token = Cookies.get('token');
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState(null);
    const [formData, setFormData] = useState({
        organization_name: '',
        address: '',
        email: '',
        phone: '',
        facebook: '',
        youtube: '',
        about: '',
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
                about: formData.about,
                email: formData.email,
                phone: formData.phone,
                youtube: formData.youtube,
                facebook: formData.facebook,
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
            console.log(error)
            setLoading(false)
            if (error.response.data.error) {
                setFormData(prevState => ({
                    ...prevState,
                    errors: error.response.data.error
                }));
            }
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
                                        <label className='fw-bold my-2'>
                                            <span>Organization Name</span>
                                            <AiFillStar className='required' />
                                        </label>
                                        <input
                                            name="organization_name"
                                            onChange={handelInputChange}
                                            defaultValue={data[0]?.organization_name}
                                            type="text"
                                            placeholder='organization name'
                                            className='form-control' />
                                        <small className='validation-error'>
                                            {
                                                formData?.errors?.organization_name ? formData?.errors?.organization_name : null
                                            }
                                        </small>
                                    </div>
                                    <div className='my-4'>
                                        <label className='fw-bold my-2'>
                                            <span>Organization Address</span>
                                            <AiFillStar className='required' />
                                        </label>
                                        <input
                                            name="address"
                                            onChange={handelInputChange}
                                            defaultValue={data[0]?.address}
                                            type="text"
                                            placeholder='organization address'
                                            className='form-control' />
                                        <small className='validation-error'>
                                            {
                                                formData?.errors?.address ? formData?.errors?.address : null
                                            }
                                        </small>
                                    </div>
                                    <div className='my-4'>
                                        <label className='fw-bold my-2'>
                                            <span>Organization Phone</span>
                                            <AiFillStar className='required' />
                                        </label>
                                        <input
                                            name="phone"
                                            onChange={handelInputChange}
                                            defaultValue={data[0]?.phone}
                                            type="text"
                                            placeholder='organization phone'
                                            className='form-control' />
                                        <small className='validation-error'>
                                            {
                                                formData?.errors?.phone ? formData?.errors?.phone : null
                                            }
                                        </small>
                                    </div>
                                </div>
                                <div className="col-md-6">

                                    <div className='my-4'>
                                        <label className='fw-bold my-2'>
                                            <span>Organization Email</span>
                                            <AiFillStar className='required' />
                                        </label>
                                        <input
                                            name="email"
                                            onChange={handelInputChange}
                                            defaultValue={data[0]?.email}
                                            type="text"
                                            placeholder='organization email'
                                            className='form-control' />
                                        <small className='validation-error'>
                                            {
                                                formData?.errors?.email ? formData?.errors?.email : null
                                            }
                                        </small>
                                    </div>
                                    <div className='my-4'>
                                        <label className='fw-bold my-2'>
                                            <span>Organization Youtube</span>
                                            <AiFillStar className='required' />
                                        </label>
                                        <input
                                            name="youtube"
                                            onChange={handelInputChange}
                                            defaultValue={data[0]?.youtube}
                                            type="text"
                                            placeholder='organization youtube'
                                            className='form-control' />
                                        <small className='validation-error'>
                                            {
                                                formData?.errors?.youtube ? formData?.errors?.youtube : null
                                            }
                                        </small>
                                    </div>
                                    <div className='my-4'>
                                        <label className='fw-bold my-2'>
                                            <span>Organization Facebook</span>
                                            <AiFillStar className='required' />
                                        </label>
                                        <input
                                            name="facebook"
                                            onChange={handelInputChange}
                                            defaultValue={data[0]?.youtube}
                                            type="text"
                                            placeholder='organization facebook'
                                            className='form-control' />
                                        <small className='validation-error'>
                                            {
                                                formData?.errors?.facebook ? formData?.errors?.facebook : null
                                            }
                                        </small>
                                    </div>

                                </div>
                                <div className="col-md-12">
                                    <div className='mb-4'>
                                        <label className='fw-bold my-2'>
                                            <span>About Organization</span>
                                            <AiFillStar className='required' />
                                        </label>
                                        <textarea
                                            name="about"
                                            onChange={handelInputChange}
                                            defaultValue={data[0]?.about}
                                            placeholder='Organization about'
                                            className='form-control'
                                            rows={6}
                                        />
                                        <small className='validation-error'>
                                            {
                                                formData?.errors?.about ? formData?.errors?.about : null
                                            }
                                        </small>
                                    </div>

                                </div>
                                <div className='d-flex justify-content-end'>
                                    <button onClick={formSubmit} className='px-4 btn btn-primary fw-bold'>save</button>
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


