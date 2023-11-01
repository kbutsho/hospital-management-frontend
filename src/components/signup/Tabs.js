import styles from '@/styles/signup/signup.module.css';
import { ROLE } from '@/constant';

const Tabs = ({ activeComponent, handleTabClick }) => {
    return (
        <ul className={`${styles.navTab} nav nav-tabs`}>
            <li className={`${styles.navItem} nav-item`}>
                <span
                    onClick={() => handleTabClick(ROLE.PATIENT)}
                    className={`nav-link ${activeComponent === ROLE.PATIENT ? 'active' : ''}`}>
                    patient
                </span>
            </li>
            <li className={`${styles.navItem} nav-item`}>
                <span
                    onClick={() => handleTabClick(ROLE.ASSISTANT)}
                    className={`nav-link ${activeComponent === ROLE.ASSISTANT ? 'active' : ''}`}>
                    assistant
                </span>
            </li>
            <li className={`${styles.navItem} nav-item`}>
                <span
                    onClick={() => handleTabClick(ROLE.DOCTOR)}
                    className={`nav-link ${activeComponent === ROLE.DOCTOR ? 'active' : ''}`}>
                    doctor
                </span>
            </li>
            <li className={`${styles.navItem} nav-item`}>
                <span
                    onClick={() => handleTabClick(ROLE.ADMINISTRATOR)}
                    className={`nav-link ${activeComponent === ROLE.ADMINISTRATOR ? 'active' : ''}`}>
                    administrator
                </span>
            </li>
        </ul>
    );
};

export default Tabs;
