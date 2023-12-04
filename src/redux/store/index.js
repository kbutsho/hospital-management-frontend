import { configureStore } from '@reduxjs/toolkit';
import productSlice from '../slice/productSlice';
import doctorSlice from '../slice/doctorSlice';

const store = configureStore({
    reducer: {
        products: productSlice,
        doctors: doctorSlice
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        })
});

export default store;

