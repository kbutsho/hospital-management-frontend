import { createSlice } from "@reduxjs/toolkit";

const departmentSlice = createSlice({
    name: 'administrator_departments',
    initialState: {
        data: [],
        totalItems: 0,
        fetchedItems: 0,
    },
    reducers: {
        storeDepartment: (state, action) => {
            state.data = action.payload;
        },
        updateDepartmentStatus: (state, action) => {
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
        removeDepartment: (state, action) => {
            const idToRemove = action.payload;
            state.data = state.data.filter(data => data.id !== idToRemove);
            state.totalItems -= 1;
        },
    }
})

export const { updateDepartmentStatus, storeDepartment, removeDepartment, totalItemsCount, fetchedItemsCount } = departmentSlice.actions;
export default departmentSlice.reducer; 