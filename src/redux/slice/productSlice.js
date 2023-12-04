import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
    name: 'products',
    initialState: {
        data: [],
        totalItems: 0,
        fetchedItems: 0,
    },
    reducers: {
        storeProduct: (state, action) => {
            state.data = action.payload;
        },
        addProduct: (state, action) => {
            state.data = [...state.data, ...action.payload];
        },
        updateProductStatus: (state, action) => {
            const { id, status } = action.payload;
            const productIndex = state.data.findIndex(product => product.id === id);
            if (productIndex !== -1) {
                state.data[productIndex].status = status;
            }
        },
        fetchedItemsCount: (state, action) => {
            state.fetchedItems = action.payload
        },
        totalItemsCount: (state, action) => {
            state.totalItems = action.payload
        },
        removeProduct: (state, action) => {
            const idToRemove = action.payload;
            state.data = state.data.filter(product => product.id !== idToRemove);
            state.totalItems -= 1;
        },
    }
})

export const { updateProductStatus, storeProduct, addProduct, removeProduct, totalItemsCount, fetchedItemsCount } = productSlice.actions;
export default productSlice.reducer; 