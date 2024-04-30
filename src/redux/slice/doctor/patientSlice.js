import { createSlice } from "@reduxjs/toolkit";

const patientSlice = createSlice({
    name: 'doctor_patients',
    initialState: {
        data: [],
        totalItems: 0,
        fetchedItems: 0,
    },
    reducers: {
        storePatient: (state, action) => {
            state.data = action.payload;
        },
        fetchedItemsCount: (state, action) => {
            state.fetchedItems = action.payload
        },
        totalItemsCount: (state, action) => {
            state.totalItems = action.payload
        },
        removePatient: (state, action) => {
            const idToRemove = action.payload;
            state.data = state.data.filter(data => data.id !== idToRemove);
            state.totalItems -= 1;
        },
        resetPatient: (state) => {
            state.data = [];
            state.totalItems = 0;
            state.fetchedItems = 0;
        },
    }
})

export const { resetPatient, storePatient, removePatient, totalItemsCount, fetchedItemsCount } = patientSlice.actions;
export default patientSlice.reducer; 