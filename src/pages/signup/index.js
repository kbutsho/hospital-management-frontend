import AdministratorSignup from '@/components/signup/AdministratorSignup';
import AssistantSignup from '@/components/signup/AssistantSignup';
import DoctorSignup from '@/components/signup/DoctorSignup';
import PatientSignup from '@/components/signup/PatientSignup';
import { ROLE } from '@/constant';
import React, { useState } from 'react';

const Index = () => {
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
