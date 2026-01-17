import { configureStore } from '@reduxjs/toolkit'
import { setUserData } from './userSlice'

export const store = configureStore({
       reducer: {

              // USER KI JGHA PE KOI BHI NAME RKH SKTE HO.
              user:setUserData
       },
})