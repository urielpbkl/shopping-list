
import { configureStore } from '@reduxjs/toolkit'
import editProductReducer from '../reducers/editProductSlice'
import modalReducer from '../reducers/showModalSlice'


export const store = configureStore({
    reducer: {
        modal: modalReducer,
        editProduct: editProductReducer
    }
})