import { configureStore } from '@reduxjs/toolkit';
import productSlice from '../slice/productSlice';
import doctorSlice from '../slice/administrator/doctorSlice';
import assistantSlice from '../slice/administrator/assistantSlice';
import chamberSlice from '../slice/administrator/chamberSlice';

const store = configureStore({
    reducer: {
        products: productSlice,
        administrator_doctors: doctorSlice,
        administrator_assistants: assistantSlice,
        administrator_chambers: chamberSlice
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        })
});

export default store;

