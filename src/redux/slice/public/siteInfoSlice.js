import { createSlice } from "@reduxjs/toolkit";

const siteInfoSlice = createSlice({
    name: 'site_info',
    initialState: {
        data: []
    },
    reducers: {
        storeSiteInfo: (state, action) => {
            state.data = action.payload;
        }
    }
})

export const { storeSiteInfo } = siteInfoSlice.actions;
export default siteInfoSlice.reducer;