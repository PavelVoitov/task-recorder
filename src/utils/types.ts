import {rootReducer, store} from "app/store";
import {FieldErrorType} from "api/todolists-api";

export type AppDispatchType = typeof store.dispatch
export type RootReducerType = typeof rootReducer
export type AppRootStateType = ReturnType<RootReducerType>
export type ThunkError = { rejectValue: { errors: string[], fieldsErrors?: FieldErrorType[] } }