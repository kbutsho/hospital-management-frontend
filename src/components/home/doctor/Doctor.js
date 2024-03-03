import { doctorData } from './doctorData';
import Image from 'next/image';
import styles from '@/styles/Home.module.css';

const Doctor = () => {
    return (
        <div className="container py-5">
            <h2 className="text-center mb-5 fw-bold text-uppercase text-success">Doctors</h2>
            <div className="row">
                {doctorData.map((doctor, index) => (
                    <div key={index} className="col-md-3">
                        <div className={`mb-4 ${styles.doctorCard}`}>
                            <div className="card-body">
                                <Image style={{ borderRadius: "6px 6px 0 0" }} height={80} width={80} layout='responsive' src={doctor.image} alt={doctor.name} />
                                <div className='px-3 pb-3'>
                                    <h5 style={{ minHeight: "50px" }} className="card-title fw-bold text-success mt-4  text-uppercase">{doctor.name}</h5>
                                    <div className='mt-3' style={{ minHeight: "50px" }}>
                                        <small className="card-text" >{doctor.designation}</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Doctor;
