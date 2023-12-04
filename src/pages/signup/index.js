import AdministratorSignup from '@/components/signup/AdministratorSignup';
import AssistantSignup from '@/components/signup/AssistantSignup';
import DoctorSignup from '@/components/signup/DoctorSignup';
import PatientSignup from '@/components/signup/PatientSignup';
import { ROLE } from '@/constant';
import React, { useState } from 'react';
import { config } from '@/config';


const Index = ({ data }) => {
    const [activeComponent, setActiveComponent] = useState(ROLE.PATIENT);
    const handleTabClick = (componentName) => {
        setActiveComponent(componentName);
    };
    return (
        <div>
            {activeComponent === ROLE.PATIENT && (
                <PatientSignup activeComponent={activeComponent} handleTabClick={handleTabClick} />
            )}
            {activeComponent === ROLE.ASSISTANT && (
                <AssistantSignup doctorWithChamberList={data.doctorWithChamberList} activeComponent={activeComponent} handleTabClick={handleTabClick} />
            )}
            {activeComponent === ROLE.DOCTOR && (
                <DoctorSignup departmentList={data.departmentList.data} activeComponent={activeComponent} handleTabClick={handleTabClick} />
            )}
            {activeComponent === ROLE.ADMINISTRATOR && (
                <AdministratorSignup activeComponent={activeComponent} handleTabClick={handleTabClick} />
            )}
        </div>
    );
};

export default Index;

export const getStaticProps = async () => {
    const fetchDepartment = await fetch(`${config.api}/department/all`);
    const fetchDoctorWithChamber = await fetch(`${config.api}/doctor-with-chamber/all`);
    const departmentList = await fetchDepartment.json();
    const doctorWithChamberList = await fetchDoctorWithChamber.json();
    return {
        props: {
            data: {
                departmentList,
                doctorWithChamberList
            }
        },
        revalidate: 30
    };
};
