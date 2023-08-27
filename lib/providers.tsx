"use client"

import { Provider } from "react-redux"
import { makeStore } from "../redux"

export const Providers = (props: React.PropsWithChildren) => {
    return (<Provider store={makeStore}>{props.children}</Provider>)
}