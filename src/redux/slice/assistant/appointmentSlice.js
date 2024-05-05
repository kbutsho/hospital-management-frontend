import { createSlice } from "@reduxjs/toolkit";

const assistantAppointmentSlice = createSlice({
    name: 'assistant_appointments',
    initialState: {
        data: [],
        totalItems: 0,
        fetchedItems: 0,
    },
    reducers: {
        storeAppointment: (state, action) => {
            state.data = action.payload;
        },
        updateAppointmentStatus: (state, action) => {
            const { id, status } = action.payload;
            const index = state.data.findIndex(data => data.id === id);
            if (index !== -1) {
                state.data[index].status = status;
            }
        },
        fetchedItemsCount: (state, action) => {
            state.fetchedItems = action.payload
        },
        totalItemsCount: (state, action) => {
            state.totalItems = action.payload
        },
        removeAppointment: (state, action) => {
            const idToRemove = action.payload;
            state.data = state.data.filter(data => data.id !== idToRemove);
            state.totalItems -= 1;
        },
        resetAppointment: (state) => {
            state.data = [];
            state.totalItems = 0;
            state.fetchedItems = 0;
        },
    }
})

export const { updateAppointmentStatus, resetAppointment, storeAppointment, removeAppointment, totalItemsCount, fetchedItemsCount } = assistantAppointmentSlice.actions;
export default assistantAppointmentSlice.reducer;