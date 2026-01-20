import { configureStore } from '@reduxjs/toolkit'
import { setUserData } from './userSlice'
import cartReducer from './cartSlice'

export const store = configureStore({
       reducer: {

              // USER KI JGHA PE KOI BHI NAME RKH SKTE HO.
              user:setUserData,
              card:cartReducer
       },
})