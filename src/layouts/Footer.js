import styles from "@/styles/mainLayout/mainLayout.module.css"
import { config } from '@/config';

const Footer = () => {
    return (
        <div>
            <div className={styles.mainFooter}>
                <small>copyright© {new Date().getFullYear()} || all rights reserved by
                    <a target='_blank' href={`${config.portfolio_url}`}> kbutsho</a></small>
            </div>
        </div>
    );
};

export default Footer;