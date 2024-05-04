import { configureStore } from '@reduxjs/toolkit'
import userReducer from './user/userSlice.js'

export const store = configureStore({
    reducer: {
        //adding reducers
        user: userReducer,
    },
    //to prevent errors in browsers that don't support
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})
