import Link from 'next/link';
import styles from '@/styles/Home.module.css';
// import Image from 'next/image';
import Image from 'next/legacy/image'
import Aos from "aos";
import { useEffect, useState } from 'react';
import axios from 'axios'
import { config } from '@/config';
import { errorHandler } from '@/helpers/errorHandler';
import { toast } from 'react-toastify';
import MainLayout from '@/layouts/MainLayout';
import { useRouter } from 'next/router';

const Department = () => {
    const [deptData, setDeptData] = useState(null);
    const router = useRouter();
    const fetchDoctor = async () => {
        try {
            const response = await axios.get(`${config.api}/department/all`)
            setDeptData(response.data.data)
        } catch (error) {
            console.log(error)
            errorHandler({ error, toast })
        }
    }
    useEffect(() => {
        fetchDoctor()
    }, [])
    useEffect(() => {
        Aos.init({ duration: 1000 });
    }, []);
    const details = (id) => {
        router.push(`department/${id}`)
    }
    return (
        <div className="container py-5" style={{ minHeight: '100vh' }}>
            <div className='mb-4 d-flex justify-content-between'>
                <h2 className="fw-bold text-uppercase text-success">Departments</h2>
            </div>
            <div className="row">
                {deptData?.slice(1, 10).map((dept, index) => (
                    <div key={index} className="col-md-4" data-aos="fade-up" onClick={() => details(dept.id)}>
                        <div className={`p-3 card mb-4 ${styles.deptCard}`}>
                            <div className="card-body">
                                <Image
                                    height={80}
                                    width={80}
                                    src={`${config.backend_api}/uploads/department/${dept.photo}`}
                                    alt={dept.name} />
                                <h5 className="card-title fw-bold text-success mt-4 text-uppercase">{dept.name}</h5>
                                <div className='mb-3' style={{ minHeight: "80px" }}>
                                    <small className="card-text">
                                        {dept?.description.length > 150 ? `${dept.description.substring(0, 150)}...` : dept.description}
                                    </small>
                                </div>
                                <button onClick={() => details(dept.id)} className="btn btn-success px-3 btn-block btn-sm fw-bold" style={{ borderRadius: "2px" }}>Learn More</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Department;
Department.getLayout = function getLayout(page) {
    return <MainLayout>{page}</MainLayout>;
};
