// import styles from "@/styles/mainLayout/mainLayout.module.css"
// import { config } from '@/config';

// const Footer = () => {
//     return (
//         <div>
//             <div className={styles.mainFooter}>
//                 <small>copyright© {new Date().getFullYear()} || all rights reserved by
//                     <a target='_blank' href={`${config.portfolio_url}`}> kbutsho</a></small>
//             </div>
//         </div>
//     );
// };

// export default Footer;

import Image from 'next/image';
import { BsFacebook, BsInstagram, BsYoutube } from 'react-icons/bs';
import Link from 'next/link';
import { BiMap } from 'react-icons/bi';
import { AiOutlineMail } from 'react-icons/ai';
import { config } from '@/config'
import { useSelector } from 'react-redux';
import { FaPhoneAlt } from "react-icons/fa";

const Footer = () => {
    const info = useSelector(state => state.site_info.data);
    return (
        <div className='footer' style={{ background: "#18253A" }}>
            <div className='container pb-4 pt-5'>
                <div className="row">
                    <div className="col-md-4 pb-3">
                        <h4 className='text-white fw-bold text-uppercase'>{info?.organization_name}</h4>
                        <p className='footer-details text-white'>
                            {info?.footer_text}
                        </p>
                        <div>
                            <Link href={`${info?.facebook}`}><BsFacebook size="26px" color="white" /></Link>
                            <Link href={`${info?.youtube}`}><BsYoutube size="26px" color="white" className='mx-3' /></Link>
                            <Link href={`${info?.facebook}`}><BsInstagram size="26px" color="white" /></Link>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <h5 className='text-white fw-bold'>Links</h5>
                        <div className='link-area d-flex flex-column'>
                            <Link className='link text-white' href="/about">about us</Link>
                            <Link className='link text-white' href="/contact">contact us</Link>
                            <Link className='link text-white' href="/our-doctors">our doctors</Link>
                            <Link className='link text-white' href="/department">departments</Link>
                            <Link className='link text-white' href="/serial">take a serial</Link>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <h5 className='text-white fw-bold'>Departments</h5>
                        <div className='link-area d-flex flex-column'>
                            <Link className='link text-white' href="/">ent</Link>
                            <Link className='link text-white' href="/">urology</Link>
                            <Link className='link text-white' href="/">geriatrics</Link>
                            <Link className='link text-white' href="/">dermatology</Link>
                            <Link className='link text-white' href="/">ophthalmology</Link>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <h5 className='text-white fw-bold mb-3'>Address</h5>
                        <div className='d-flex'>
                            <BiMap color='white' size="24px" />
                            <p className='ms-2 text-white'>
                                {info?.address}
                            </p>
                        </div>
                        <div className='d-flex'>
                            <AiOutlineMail color='white' size="22px" />
                            <p className='ms-2 text-white' style={{ fontSize: "14px" }}> {info?.email}</p>
                        </div>
                        <div className='d-flex'>
                            <FaPhoneAlt color='white' size="20px" />
                            <p className='ms-2 text-white' style={{ fontSize: "14px" }}> {info?.phone}</p>
                        </div>
                    </div>
                </div>
                <div className='text-center text-white pt-4'>
                    <small style={{ fontSize: "14px", fontWeight: "bold" }}>copyright© {new Date().getFullYear()} || all rights reserved by
                        <a style={{ textDecoration: "none", color: "white", }} target='_blank' href={`${config.portfolio_url}`}> kbutsho</a></small>
                </div>
            </div>
        </div>
    );
};

export default Footer;