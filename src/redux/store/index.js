// import { combineReducers, configureStore } from "@reduxjs/toolkit";
// import { persistStore, persistReducer } from 'redux-persist';
// import storage from 'redux-persist/lib/storage';
// import productSlice from "../slice/productSlice";

// const persistConfig = {
//     key: 'root',
//     storage,
//     limits: 50,
// };
// const rootReducer = combineReducers({
//     products: productSlice,
// });
// const persistedReducer = persistReducer(persistConfig, rootReducer);
// export const store = configureStore({
//     reducer: persistedReducer,
//     middleware: getDefaultMiddleware =>
//         getDefaultMiddleware({
//             serializableCheck: false
//         }),
// });

// export const persistor = persistStore(store);


// import { configureStore } from "@reduxjs/toolkit";
// import productSlice from "../slice/productSlice";

// const store = configureStore({
//     reducer: {
//         products: productSlice
//     }
// });
// export default store;

import { configureStore } from '@reduxjs/toolkit';
import productSlice from '../slice/productSlice';

const store = configureStore({
    reducer: {
        products: productSlice
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        })
});

export default store;

