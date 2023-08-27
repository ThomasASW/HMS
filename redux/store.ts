import { configureStore, type ThunkAction, type Action } from "@reduxjs/toolkit"
import { middleware } from "./middleware"
import { rootReducer } from "./rootReducer"
import {
    useSelector as useReduxSelector,
    useDispatch as useReduxDispatch,
    type TypedUseSelectorHook,
} from 'react-redux'

export const makeStore = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware().concat(middleware)
    },
    devTools: true
})

export const useDispatch = () => useReduxDispatch<ReduxDispatch>()
export const useSelector: TypedUseSelectorHook<AppState> = useReduxSelector

export type AppStore = typeof makeStore
export type AppState = ReturnType<typeof makeStore.getState>
export type ReduxDispatch = typeof makeStore.dispatch
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    AppState,
    unknown,
    Action
>