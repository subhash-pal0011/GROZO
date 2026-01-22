import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import cartReducer from './cartSlice'

export const store = configureStore({
       reducer: {

              // USER KI JGHA PE KOI BHI NAME RKH SKTE HO.
              user:userReducer,
              card:cartReducer
       },
})