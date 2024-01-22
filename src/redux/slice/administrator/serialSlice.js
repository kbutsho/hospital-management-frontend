import { createSlice } from "@reduxjs/toolkit";

const serialSlice = createSlice({
    name: 'administrator_serials',
    initialState: {
        data: [],
        totalItems: 0,
        fetchedItems: 0,
    },
    reducers: {
        storeSerial: (state, action) => {
            state.data = action.payload;
        },
        updateSerialStatus: (state, action) => {
            const { id, status } = action.payload;
            const SerialIndex = state.data.findIndex(serial => serial.id === id);
            if (SerialIndex !== -1) {
                state.data[SerialIndex].status = status;
            }
        },
        fetchedItemsCount: (state, action) => {
            state.fetchedItems = action.payload
        },
        totalItemsCount: (state, action) => {
            state.totalItems = action.payload
        },
        removeSerial: (state, action) => {
            const idToRemove = action.payload;
            state.data = state.data.filter(serial => serial.id !== idToRemove);
            state.totalItems -= 1;
        },
        resetSerial: (state) => {
            state.data = [];
            state.totalItems = 0;
            state.fetchedItems = 0;
        },
    }
})

export const { updateSerialStatus, resetSerial, storeSerial, removeSerial, totalItemsCount, fetchedItemsCount } = serialSlice.actions;
export default serialSlice.reducer; 