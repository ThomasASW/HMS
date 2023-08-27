import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { NoticeType } from "antd/es/message/interface";

export interface Notify {
    type: NoticeType,
    content: string | null,
    duration: number
}

const initialState: Notify = {
    type: "error",
    content: "",
    duration: 6
}

export const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        notify(state, action: PayloadAction<Notify>) {
            const payload = action.payload;
            state.content = payload.content
            state.duration = payload.duration
            state.type = payload.type
        }
    },
})