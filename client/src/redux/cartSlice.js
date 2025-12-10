import { createSlice } from "@reduxjs/toolkit";

// 1. Initial State (Load from localStorage if available)
const loadCartFromStorage = () => {
  try {
    const savedCart = localStorage.getItem("wavewander_cart");
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    return [];
  }
};

const initialState = {
  items: loadCartFromStorage(),
};

// 2. Create Slice
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existingItem = state.items.find(
        (item) => item.product_id === product.product_id
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...product, quantity: 1 });
      }

      // Save to localStorage
      localStorage.setItem("wavewander_cart", JSON.stringify(state.items));
    },

    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter((item) => item.product_id !== productId);
      localStorage.setItem("wavewander_cart", JSON.stringify(state.items));
    },

    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find((item) => item.product_id === productId);
      if (item && quantity > 0) {
        item.quantity = quantity;
      }
      localStorage.setItem("wavewander_cart", JSON.stringify(state.items));
    },

    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem("wavewander_cart");
    },
  },
});

// 3. Export Actions and Reducer
export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
