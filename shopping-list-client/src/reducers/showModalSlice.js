import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    showModal: false,
};

const showModalSlice = createSlice({
    name: "modal",
    initialState,
    reducers: {
        setModal: (state, action) => {
            state.showModal = action.payload.showModal
        },
    },
});

// Action creators are generated for each case reducer function
export const { setModal } = showModalSlice.actions

export default showModalSlice.reducer //LO EXPORTARLO PARA LLEVARLO AL "STORE(store.js)"