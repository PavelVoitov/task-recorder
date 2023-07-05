import {store} from "app/store";
import {FieldErrorType} from "api/todolists-api";
import {rootReducer} from "app/reducer";

export type AppDispatchType = typeof store.dispatch
export type RootReducerType = typeof rootReducer
export type AppRootStateType = ReturnType<RootReducerType>
export type ThunkError = { rejectValue: { errors: string[], fieldsErrors?: FieldErrorType[] } }