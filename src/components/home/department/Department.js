import Link from 'next/link';
import styles from '@/styles/Home.module.css';
import ent from '../../../assets/department/ent.png';
import urology from '../../../assets/department/urology.png';
import geriatrics from '../../../assets/department/old-man.png';
import ophthalmology from '../../../assets/department/ophthalmology.png';
import dermatology from '../../../assets/department/skin.png';
import pediatrics from '../../../assets/department/pediatrics.png';
import neurology from '../../../assets/department/neurology.png';
import orthopedics from '../../../assets/department/bone.png';
import cardiology from '../../../assets/department/cardiology.png';
import Image from 'next/image';

const Department = () => {

    const deptData = [
        { name: "ENT", description: "The Ear, Nose, and Throat (ENT) department specializes in the diagnosis and treatment of conditions affecting the ears, nose, throat, and related structures.", imageUrl: ent },
        { name: "Urology", description: "The Urology department deals with the diagnosis and treatment of disorders of the urinary tract system in both males and females, as well as the male reproductive system.", imageUrl: urology },
        { name: "Geriatrics", description: "The Geriatrics department provides specialized care for elderly patients, focusing on the unique health concerns and needs associated with aging.", imageUrl: geriatrics },
        { name: "Ophthalmology", description: "The Ophthalmology department specializes in the diagnosis and treatment of eye diseases and disorders, including cataracts, glaucoma, and refractive errors.", imageUrl: ophthalmology },
        { name: "Dermatology", description: "The Dermatology department focuses on the diagnosis and treatment of skin, hair, and nail conditions, including acne, eczema, psoriasis, and skin cancer.", imageUrl: dermatology },
        { name: "Pediatrics", description: "The Pediatrics department provides medical care for infants, children, and adolescents, addressing a wide range of health issues from routine check-ups to complex medical conditions.", imageUrl: pediatrics },
        { name: "Neurology", description: "The Neurology department specializes in the diagnosis and treatment of disorders of the nervous system, including conditions affecting the brain, spinal cord, and nerves.", imageUrl: neurology },
        { name: "Orthopedics", description: "The Orthopedics department focuses on the diagnosis and treatment of musculoskeletal disorders, including fractures, arthritis, sports injuries, and spinal conditions.", imageUrl: orthopedics },
        { name: "Cardiology", description: "The Orthopedics department focuses on the diagnosis and treatment of musculoskeletal disorders, including fractures, arthritis, sports injuries, and spinal conditions.", imageUrl: cardiology },

    ];
    return (
        <div className="container py-5">
            <h2 className="text-center mb-5 fw-bold text-uppercase text-success">Departments</h2>
            <div className="row">
                {deptData.map((dept, index) => (
                    <div key={index} className="col-md-4">
                        <div className={`card mb-4 ${styles.deptCard}`}>
                            <div className="card-body">
                                <Image height={80} width={80} src={dept.imageUrl} alt={dept.name} />
                                <h5 className="card-title fw-bold text-success mt-4 text-uppercase">{dept.name}</h5>
                                <div className='mb-3'>
                                    <small className="card-text" >{dept.description}</small>
                                </div>
                                <Link href="/" className="btn btn-primary btn-block btn-sm fw-bold">Learn More</Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Department;
