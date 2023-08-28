import { PayloadAction, createSlice } from "@reduxjs/toolkit"

export interface Filter {
    name: string | undefined,
    address: string | undefined,
    state: string | undefined,
    country: string | undefined,
}

const initialState: Filter = {
    address: undefined,
    country: undefined,
    name: undefined,
    state: undefined
}

export const filterSlice = createSlice({
    name: "filter",
    initialState,
    reducers: {
        filter(state, action: PayloadAction<Filter>) {
            const payload = action.payload;
            state.name = payload.name
            state.address = payload.address
            state.country = payload.country
            state.state = payload.state
        }
    },
})