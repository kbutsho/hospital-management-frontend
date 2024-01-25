import { configureStore } from '@reduxjs/toolkit';
import productSlice from '../slice/productSlice';
import doctorSlice from '../slice/administrator/doctorSlice';
import assistantSlice from '../slice/administrator/assistantSlice';
import chamberSlice from '../slice/administrator/chamberSlice';
import departmentSlice from '../slice/administrator/departmentSlice';
import scheduleSlice from '../slice/administrator/scheduleSlice';
import serialSlice from '../slice/administrator/serialSlice';
import patientSlice from '../slice/administrator/patientSlice';
import appointmentSlice from '../slice/administrator/appointmentSlice';
import doctorAppointmentSlice from '../slice/doctor/appointmentSlice';

const store = configureStore({
    reducer: {
        products: productSlice,
        administrator_doctors: doctorSlice,
        administrator_assistants: assistantSlice,
        administrator_chambers: chamberSlice,
        administrator_departments: departmentSlice,
        administrator_schedules: scheduleSlice,
        administrator_serials: serialSlice,
        administrator_patients: patientSlice,
        administrator_appointments: appointmentSlice,
        // doctor
        doctor_appointments: doctorAppointmentSlice
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        })
});

export default store;

