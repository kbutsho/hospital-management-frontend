import { createSlice } from "@reduxjs/toolkit";

const scheduleSlice = createSlice({
    name: 'administrator_schedules',
    initialState: {
        data: [],
        totalItems: 0,
        fetchedItems: 0,
    },
    reducers: {
        storeSchedule: (state, action) => {
            state.data = action.payload;
        },
        updateScheduleStatus: (state, action) => {
            const { id, status } = action.payload;
            const index = state.data.findIndex(schedule => schedule.id === id);
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
        removeSchedule: (state, action) => {
            const idToRemove = action.payload;
            state.data = state.data.filter(schedule => schedule.id !== idToRemove);
            state.totalItems -= 1;
        },
    }
})

export const { updateScheduleStatus, storeSchedule, removeSchedule, totalItemsCount, fetchedItemsCount } = scheduleSlice.actions;
export default scheduleSlice.reducer; 