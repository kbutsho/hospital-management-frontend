import { createSlice } from "@reduxjs/toolkit";

const chamberSlice = createSlice({
    name: 'administrator_chambers',
    initialState: {
        data: [],
        totalItems: 0,
        fetchedItems: 0,
    },
    reducers: {
        storeChamber: (state, action) => {
            state.data = action.payload;
        },
        updateChamberStatus: (state, action) => {
            const { id, status } = action.payload;
            const index = state.data.findIndex(chamber => chamber.id === id);
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
        removeChamber: (state, action) => {
            const idToRemove = action.payload;
            state.data = state.data.filter(chamber => chamber.id !== idToRemove);
            state.totalItems -= 1;
        },
    }
})

export const { updateChamberStatus, storeChamber, removeChamber, totalItemsCount, fetchedItemsCount } = chamberSlice.actions;
export default chamberSlice.reducer; 