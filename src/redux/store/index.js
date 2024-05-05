// import { configureStore } from '@reduxjs/toolkit';
// import productSlice from '../slice/productSlice';
// import doctorSlice from '../slice/administrator/doctorSlice';
// import assistantSlice from '../slice/administrator/assistantSlice';
// import chamberSlice from '../slice/administrator/chamberSlice';
// import departmentSlice from '../slice/administrator/departmentSlice';
// import scheduleSlice from '../slice/administrator/scheduleSlice';
// import serialSlice from '../slice/administrator/serialSlice';
// import patientSlice from '../slice/administrator/patientSlice';
// import appointmentSlice from '../slice/administrator/appointmentSlice';
// import doctorAppointmentSlice from '../slice/doctor/appointmentSlice';
// import siteInfoSlice from '../slice/public/siteInfoSlice';

// const store = configureStore({
//     reducer: {
//         products: productSlice,
//         administrator_doctors: doctorSlice,
//         administrator_assistants: assistantSlice,
//         administrator_chambers: chamberSlice,
//         administrator_departments: departmentSlice,
//         administrator_schedules: scheduleSlice,
//         administrator_serials: serialSlice,
//         administrator_patients: patientSlice,
//         administrator_appointments: appointmentSlice,
//         // doctor
//         doctor_appointments: doctorAppointmentSlice,
//         // public info
//         site_info: siteInfoSlice
//     },

//     middleware: (getDefaultMiddleware) =>
//         getDefaultMiddleware({
//             serializableCheck: false
//         })
// });

// export default store;



import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import productSlice from '../slice/productSlice';
import doctorSlice from '../slice/administrator/doctorSlice';
import assistantSlice from '../slice/administrator/assistantSlice';
import chamberSlice from '../slice/administrator/chamberSlice';
import departmentSlice from '../slice/administrator/departmentSlice';
import scheduleSlice from '../slice/administrator/scheduleSlice';
import serialSlice from '../slice/administrator/serialSlice';
import assistantSerialSlice from '../slice/assistant/serialSlice';
import patientSlice from '../slice/administrator/patientSlice';
import appointmentSlice from '../slice/administrator/appointmentSlice';
import doctorAppointmentSlice from '../slice/doctor/appointmentSlice';
import assistantAppointmentSlice from '../slice/assistant/appointmentSlice';
import doctorPatientSlice from '../slice/doctor/patientSlice';
import assistantPatientSlice from '../slice/assistant/patientSlice';
import siteInfoSlice from '../slice/public/siteInfoSlice';

const persistConfig = {
    key: 'root',
    storage
};

const rootReducer = combineReducers({
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
    doctor_appointments: doctorAppointmentSlice,
    doctor_patients: doctorPatientSlice,
    // assistant
    assistant_serials: assistantSerialSlice,
    assistant_patients: assistantPatientSlice,
    assistant_appointments: assistantAppointmentSlice,
    // public info
    site_info: siteInfoSlice
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        })
});

export const persistor = persistStore(store);
export default store;
