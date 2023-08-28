import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { ObjectId } from "mongodb";

export interface Storage {
    hotelId: ObjectId | undefined
}

const initialState: Storage = {
    hotelId: undefined
}

export const storageSlice = createSlice({
    name: "storage",
    initialState,
    reducers: {
        store(state, action: PayloadAction<Storage>) {
            const payload = action.payload;
            state.hotelId = payload.hotelId
        }
    },
})