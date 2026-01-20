// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//        cartData: [],
// };

// const cardSlice = createSlice({
//        name: "card",
//        initialState,
//        reducers: {
//               addCardData: (state, action) => {
//                      const item = state.cartData.find(
//                             (item) => item._id === action.payload._id
//                      );

//                      if (item) {
//                             item.qty += 1;
//                      } else {
//                             state.cartData.push({ ...action.payload, qty: 1});
//                      }
//               },

//               subtCardData: (state, action) => {
//                      const item = state.cartData.find(
//                             (item) => item._id === action.payload
//                      );

//                      if (!item) return;

//                      if (item.qty > 1) {
//                             item.qty -= 1;
//                      } else {
//                             state.cartData = state.cartData.filter(
//                                    (p) => p._id !== action.payload
//                             );
//                      }
//               },
//        },
// });

// export const { addCardData, subtCardData } = cardSlice.actions;
// export default cardSlice.reducer;



import { createSlice } from "@reduxjs/toolkit";

const initialState = {
       cartData: [],
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
       },
});

export const { addCartData, removeCartData } = cartSlice.actions;
export default cartSlice.reducer;
