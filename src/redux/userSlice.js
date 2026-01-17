import { createSlice } from '@reduxjs/toolkit'

const initialState = {
       // 🧠ISKO HUM USE STATE MEA JESE BANTE HII EK SET KRNE KE LIYE EK USE KE LIYE KUCCH VESA
       userData: null  // 🧠JB KOI DATA NHI RHTA TO STRTING MEA YE NULL HI RHTA HII.
}

const userSlice = createSlice({
       name: "user",
       initialState,
       reducers: {
           //🧠state IS LIYE LIKH RHE HII KYUKI UPER KA userData ACCESS KE LIYE         
              setUserData:(state , action)=>{
                     state.userData=action.payload
              }
       }
})
export const {setUserData} = userSlice.actions
export default userSlice.reducer