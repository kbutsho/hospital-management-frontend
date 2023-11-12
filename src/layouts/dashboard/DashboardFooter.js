import React from 'react';
import styles from "@/styles/dashboardLayout/dashboardLayout.module.css"
import { config } from '@/config';

const DashboardFooter = () => {
    return (
        <div className={styles.dashboardFooter}>
            <small>copyright© {new Date().getFullYear()} || all rights reserved by
                <a target='_blank' href={`${config.portfolio_url}`}> kbutsho</a></small>
        </div>
    );
};

export default DashboardFooter;