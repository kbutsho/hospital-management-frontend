import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '@/styles/signup/signup.module.css';

const SignupNavigation = () => {
    const router = useRouter();
    const currentURL = (router.asPath).split('/')[2];

    return (
        <ul className={`${styles.navTab} nav nav-tabs`}>
            <NavItem currentURL={currentURL} path="patient" label="patient" />
            <NavItem currentURL={currentURL} path="assistant" label="assistant" />
            <NavItem currentURL={currentURL} path="doctor" label="doctor" />
            <NavItem currentURL={currentURL} path="administrator" label="administrator" />
        </ul>
    );
};

const NavItem = ({ currentURL, path, label }) => (
    <li className={`${styles.navItem} nav-item`}>
        <Link
            href={`/signup/${path}`}
            className={`nav-link ${currentURL === path ? 'active' : ''}`}>
            {label}
        </Link>
    </li>
);

export default SignupNavigation;
