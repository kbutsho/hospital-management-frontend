import AdministratorSignup from '@/components/signup/AdministratorSignup';
import AssistantSignup from '@/components/signup/AssistantSignup';
import DoctorSignup from '@/components/signup/DoctorSignup';
import { ROLE } from '@/constant';
import React, { useState } from 'react';


const Index = () => {
    const [activeComponent, setActiveComponent] = useState(ROLE.ASSISTANT);
    const handleTabClick = (componentName) => {
        setActiveComponent(componentName);
    };
    return (
        <div>
            {activeComponent === ROLE.ASSISTANT && (
                <AssistantSignup activeComponent={activeComponent} handleTabClick={handleTabClick} />
            )}
            {activeComponent === ROLE.DOCTOR && (
                <DoctorSignup activeComponent={activeComponent} handleTabClick={handleTabClick} />
            )}
            {activeComponent === ROLE.ADMINISTRATOR && (
                <AdministratorSignup activeComponent={activeComponent} handleTabClick={handleTabClick} />
            )}
        </div>
    );
};

export default Index;

// export const getStaticProps = async () => {
//     const fetchDepartment = await fetch(`${config.api}/department/all`);
//     const fetchDoctorWithChamber = await fetch(`${config.api}/doctor-with-chamber/all`);
//     const departmentList = await fetchDepartment.json();
//     const doctorWithChamberList = await fetchDoctorWithChamber.json();
//     return {
//         props: {
//             data: {
//                 departmentList,
//                 doctorWithChamberList
//             }
//         },
//         revalidate: 30
//     };
// };
