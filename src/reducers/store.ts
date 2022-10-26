import {tasksReducer} from './tasks-reducer'
import {combineReducers, legacy_createStore} from "redux";
import {todolistsReducer} from "./todolists-reducer";


const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer
})

export const store = legacy_createStore(rootReducer);

export type AppRootStateType = ReturnType<typeof rootReducer>

// @ts-ignore
window.store = store;
