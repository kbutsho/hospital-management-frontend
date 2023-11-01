import React from 'react';
import { AiFillStar } from 'react-icons/ai';
import Link from 'next/link';
import styles from '@/styles/login/login.module.css';

const Login = () => {
    return (
        <div className={styles.body}>
            <div className={styles.main}>
                <div className={styles.box}>
                    <h4 className={styles.heading}>Login</h4>
                    <form>
                        <div className="form-group mb-3">
                            <label htmlFor="credential" className='mb-2'>
                                <span className='fw-bold'>email or phone</span>
                                <AiFillStar className='required' />
                            </label>
                            <input
                                type="text"
                                id="credential"
                                name="credential"
                                placeholder='email or password'
                                className='form-control'
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="passwords" className='mb-2'>
                                <span className='fw-bold'>passwords</span>
                                <AiFillStar className='required' />
                            </label>
                            <input
                                type="text"
                                id="passwords"
                                name="passwords"
                                placeholder='enter passwords'
                                className='form-control'
                            />
                        </div>
                        <div className="form-group mt-4 mb-3">
                            <input type="submit" className='btn btn-primary w-100 fw-bold' value="Submit" />
                        </div>
                    </form>
                    <div className='d-flex justify-content-between'>
                        <div>
                            <span className='small'><Link href="/home" className='link'>Home</Link></span>
                        </div>
                        <div>
                            <span className='small'>
                                <span>new user? </span>
                                <Link href="/signup/patient" className='link'>signup here</Link>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
