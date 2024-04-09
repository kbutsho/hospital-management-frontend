import { doctorData } from './doctorData';
// import Image from 'next/image';
import Image from 'next/legacy/image'
import styles from '@/styles/Home.module.css';

const Doctor = () => {
    return (
        <div className="container py-4">
            <h2 className="mb-4 fw-bold text-uppercase text-success">our Doctors</h2>
            <div className="row">
                {doctorData.map((doctor, index) => (
                    <div key={index} className="col-md-3">
                        <div className={`mb-4 ${styles.doctorCard}`}>
                            <div className="card-body">
                                <div className='p-4'>
                                    <Image style={{ borderRadius: "6px" }} height={80} width={80} layout='responsive' src={doctor.image} alt={doctor.name} />
                                </div>
                                <div className='px-3 pb-3'>
                                    <h5 style={{ minHeight: "50px" }} className="card-title fw-bold text-success mt-4  text-uppercase">{doctor.name}</h5>
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
