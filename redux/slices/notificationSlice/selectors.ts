import { AppState } from "../../store"

export const getNotificationContent = (state: AppState) => state.notify;