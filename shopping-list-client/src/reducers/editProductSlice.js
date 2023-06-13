import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    editProduct: false,
    editProductData: {}
};

const editProductSlice = createSlice({
    name: "editProduct",
    initialState,
    reducers: {
        setEditProduct: (state, action) => {
            state.editProduct = action.payload.editProduct
            state.editProductData = action.payload.editProductData
        },
    },
});

// Action creators are generated for each case reducer function
export const { setEditProduct } = editProductSlice.actions

export default editProductSlice.reducer //LO EXPORTARLO PARA LLEVARLO AL "STORE(store.js)"