import { ROLE } from '@/constant';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { BiUserCircle } from 'react-icons/bi';
import icon from "../assets/icon.jpg"
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Image from 'next/image';

const Navbar = () => {
    const info = useSelector(state => state.site_info.data);
    const token = Cookies.get('token');
    const role = Cookies.get('role');
    const router = useRouter()

    const handelLogout = () => {
        Cookies.remove('name')
        Cookies.remove('token')
        Cookies.remove('role')
        router.push('/')
        toast.success("logout successfully!")
    }
    return (
        <div>
            <nav
                className="container navbar navbar-expand-lg fixed-top"
                style={{ background: "white", padding: "12px 0" }}>
                <div
                    className="container"
                    style={{ padding: "8px 14px", borderRadius: "2px", background: "white" }}>
                    <Image src={icon} height={60} width={60} alt="icon" />
                    <Link
                        className="navbar-brand fw-bold text-success text-uppercase"
                        href="/">{info?.organization_name}</Link>
                    <button
                        style={{ border: "none", boxShadow: "none", outline: "none" }}
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNavAltMarkup"
                        aria-controls="navbarNavAltMarkup"
                        aria-expanded="false"
                        aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                        <div className="navbar-nav ms-auto">
                            <Link className="nav-link fw-bold text-black" href="/">HOME</Link>
                            <Link className="nav-link fw-bold text-black" href="/doctors">DOCTOR</Link>
                            <Link className="nav-link fw-bold text-black" href="/department">DEPARTMENT</Link>
                            <Link className="nav-link fw-bold text-black" href="/serial">SERIAL</Link>
                            <Link className="nav-link fw-bold text-black" href="/about">ABOUT</Link>
                            <Link className="nav-link fw-bold text-black me-3" href="/contact">CONTACT</Link>

                            <div className='dropdown'>
                                <button
                                    style={{ borderRadius: "4px" }}
                                    className={`btn btn-outline-success dropdown-toggle pt-2 fw-bold text-uppercase`}
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false">
                                    <BiUserCircle size="20" className="mb-1" /> account
                                </button>
                                <ul className='dropdown-menu'>
                                    {
                                        token && role ? (
                                            <>
                                                <li><button onClick={handelLogout} className="dropdown-item fw-bold text-danger text-uppercase">Logout</button></li>
                                                {role === ROLE.ADMINISTRATOR && (
                                                    <li>
                                                        <Link className="dropdown-item fw-bold text-uppercase" href="/administrator/dashboard">DASHBOARD</Link>
                                                    </li>
                                                )}
                                                {role === ROLE.DOCTOR && (
                                                    <li>
                                                        <Link className="dropdown-item fw-bold text-uppercase" href="/doctor/profile">DASHBOARD</Link>
                                                    </li>
                                                )}
                                                {role === ROLE.ASSISTANT && (
                                                    <li> <Link className="dropdown-item fw-bold text-uppercase" href="/assistant/profile">DASHBOARD</Link></li>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <li><Link className="dropdown-item fw-bold text-uppercase" href="/login">Login</Link></li>
                                                <li><Link className="dropdown-item fw-bold text-uppercase" href="/signup">Signup</Link></li>
                                            </>
                                        )
                                    }
                                </ul>
                            </div>





                            {/* {
                                        token && role ? (
                                            <li className='dropdown-item'>
                                                
                                            </li>
                                        ) : (
                                            <li lassName='dropdown-item'>
                                                <Link className="nav-link fw-bold text-dark" href="/login">LOGIN</Link>
                                            </li>
                                            <li lassName='dropdown-item'>
                                                <Link className="nav-link fw-bold text-dark" href="/signup">SIGNUP</Link>  
                                            </li>
                                        )
                                    } */}
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;