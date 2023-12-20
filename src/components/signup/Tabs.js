import styles from '@/styles/signup/signup.module.css';
import { ROLE } from '@/constant';
import { AiTwotoneClockCircle } from 'react-icons/ai';

const Tabs = ({ activeComponent, handleTabClick }) => {
    return (
        <ul className={`${styles.navTab} nav nav-tabs`}>
            <li className={`${styles.navItem} nav-item`}>
                <span
                    onClick={() => handleTabClick(ROLE.ASSISTANT)}
                    className={`text-uppercase nav-link ${activeComponent === ROLE.ASSISTANT ? 'active' : 'text-black-50'}`}>
                    <div className='d-flex justify-content-between'>
                        <div>assistant</div>
                        {activeComponent === ROLE.ASSISTANT ?
                            <div><AiTwotoneClockCircle size="14" color="green" /></div>
                            : null
                        }
                    </div>
                </span>
            </li>
            <li className={`${styles.navItem} nav-item`}>
                <span
                    onClick={() => handleTabClick(ROLE.DOCTOR)}
                    className={`text-uppercase nav-link ${activeComponent === ROLE.DOCTOR ? 'active' : 'text-black-50'}`}>
                    <div className='d-flex justify-content-between'>
                        <div>doctor</div>
                        {activeComponent === ROLE.DOCTOR ?
                            <div><AiTwotoneClockCircle size="14" color="green" /></div>
                            : null
                        }
                    </div>
                </span>
            </li>
            <li className={`${styles.navItem} nav-item`}>
                <span
                    onClick={() => handleTabClick(ROLE.ADMINISTRATOR)}
                    className={`text-uppercase nav-link ${activeComponent === ROLE.ADMINISTRATOR ? 'active' : 'text-black-50'}`}>
                    <div className='d-flex justify-content-between'>
                        <div>administrator</div>
                        {activeComponent === ROLE.ADMINISTRATOR ?
                            <div><AiTwotoneClockCircle size="14" color="green" /></div>
                            : null
                        }
                    </div>
                </span>
            </li>
        </ul>
    );
};

export default Tabs;
