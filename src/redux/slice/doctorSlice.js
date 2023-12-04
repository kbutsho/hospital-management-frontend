import { createSlice } from "@reduxjs/toolkit";

const doctorSlice = createSlice({
    name: 'doctors',
    initialState: {
        data: [],
        totalItems: 0,
        fetchedItems: 0,
    },
    reducers: {
        storeDoctor: (state, action) => {
            state.data = action.payload;
        },
        updateDoctorStatus: (state, action) => {
            const { id, status } = action.payload;
            const DoctorIndex = state.data.findIndex(doctor => doctor.id === id);
            if (DoctorIndex !== -1) {
                state.data[DoctorIndex].status = status;
            }
        },
        fetchedItemsCount: (state, action) => {
            state.fetchedItems = action.payload
        },
        totalItemsCount: (state, action) => {
            state.totalItems = action.payload
        },
        removeDoctor: (state, action) => {
            const idToRemove = action.payload;
            state.data = state.data.filter(doctor => doctor.id !== idToRemove);
            state.totalItems -= 1;
        },
    }
})

export const { updateDoctorStatus, storeDoctor, removeDoctor, totalItemsCount, fetchedItemsCount } = doctorSlice.actions;
export default doctorSlice.reducer; 