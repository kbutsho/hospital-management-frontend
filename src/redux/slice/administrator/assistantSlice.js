import { createSlice } from "@reduxjs/toolkit";

const assistantSlice = createSlice({
    name: 'administrator_assistants',
    initialState: {
        data: [],
        totalItems: 0,
        fetchedItems: 0,
    },
    reducers: {
        storeAssistant: (state, action) => {
            state.data = action.payload;
        },
        updateAssistantStatus: (state, action) => {
            const { userId, status } = action.payload;
            const index = state.data.findIndex(assistant => assistant.userId === userId);
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
        removeAssistant: (state, action) => {
            const idToRemove = action.payload;
            state.data = state.data.filter(assistant => assistant.assistantId !== idToRemove);
            state.totalItems -= 1;
        },
    }
})

export const { updateAssistantStatus, storeAssistant, removeAssistant, totalItemsCount, fetchedItemsCount } = assistantSlice.actions;
export default assistantSlice.reducer; 