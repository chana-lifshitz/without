import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RecipeModel } from "../models/wine";

const shoppingSlice = createSlice({
  name: 'shoppingSlice',
  initialState: { shoppingCart: [] as RecipeModel[] },
  reducers: {
    addToCart: (state, action: PayloadAction<RecipeModel>) => {
      state.shoppingCart.push(action.payload);
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.shoppingCart = state.shoppingCart.filter(item => item.id !== action.payload);
    }
  },
});

export const { addToCart, removeFromCart } = shoppingSlice.actions;
export default shoppingSlice.reducer;
