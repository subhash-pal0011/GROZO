import { createSlice } from "@reduxjs/toolkit";

const initialState = {
       cartData: [],
       totalPrice: 0,
       deliveryCharge: 40,
       platformCharge: 5,
       discount: 0,
       grandTotal: 0,
};

const cartSlice = createSlice({
       name: "card",
       initialState,
       reducers: {
              addCartData: (state, action) => {
                     const item = state.cartData.find(
                            (i) => i._id === action.payload._id
                     );

                     if (item) {
                            item.qty += 1;
                     } else {
                            state.cartData.push({ ...action.payload, qty: 1 });
                     }
              },

              removeCartData: (state, action) => {
                     const item = state.cartData.find(
                            (i) => i._id === action.payload
                     );

                     if (item && item.qty > 1) {
                            item.qty -= 1;
                     } else {
                            state.cartData = state.cartData.filter(
                                   (i) => i._id !== action.payload
                            );
                     }
              },

              calculateTotal: (state) => {
                     //                              reduce mea initial value batani padti hii isliye ,0
                     state.totalPrice = state.cartData.reduce((sum, item) => sum + item.price * item.qty, 0 );

                     state.deliveryCharge = state.totalPrice > 100 ? 5 : 40;

                     let calculatedDiscount = 0;
                     if (state.totalPrice >= 500) {
                            calculatedDiscount = state.totalPrice * 0.10;
                     } else if (state.totalPrice >= 300) {
                            calculatedDiscount = state.totalPrice * 0.08; 
                     } else if (state.totalPrice >= 150) {
                            calculatedDiscount = state.totalPrice * 0.05; 
                     }
                     state.discount = Math.min(Math.floor(calculatedDiscount), 100);
                     // 4️⃣ final amount
                     state.grandTotal = state.totalPrice + state.deliveryCharge + state.platformCharge - state.discount;
              }

       },
});
export const { addCartData, removeCartData, calculateTotal } = cartSlice.actions;
export default cartSlice.reducer;


