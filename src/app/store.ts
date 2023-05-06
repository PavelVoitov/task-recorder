import {tasksReducer} from 'features/TodolistsList/Todolists/Task/tasks-reducer'
import {ActionCreatorsMapObject, bindActionCreators, combineReducers, compose} from "redux";
import {todolistsReducer} from "features/TodolistsList/Todolists/todolists-reducer";
import thunk from 'redux-thunk'
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {appReducer} from "./app-reducer";
import {authReducer} from "features/Auth/auth-reducer";
import {configureStore} from "@reduxjs/toolkit";
import {useMemo} from "react";

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    }
}

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer
})

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .prepend(thunk)
})

export const AppDispatch = () => useDispatch<AppDispatchType>()
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector

//types
export type RootReducerType = typeof rootReducer
export type AppRootStateType = ReturnType<RootReducerType>
type AppDispatchType = typeof store.dispatch

// @ts-ignore
window.store = store;

export const useAction = <T extends ActionCreatorsMapObject<any>>(actions: T) => {
    const dispatch = AppDispatch()
    return  useMemo(() => {
        return bindActionCreators(actions, dispatch)
    }, [])
}
