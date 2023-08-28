import { notificationSlice } from "./slices";
import { filterSlice } from "./slices/filterSlice/filterSlice";
import { storageSlice } from "./slices/storageSlice/storageSlice";

export const rootReducer = {
    notify: notificationSlice.reducer,
    filter: filterSlice.reducer,
    storage: storageSlice.reducer
}