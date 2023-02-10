import {todolistsApi, TodolistType} from "../../../api/todolists-api";
import {AnyAction, Dispatch} from "redux";
import {RequestStatusType, setAppStatusAC} from "../../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../../utils/error-utils";
import {setTasksTC} from "./tasks-reducer";
import {ThunkAction} from "redux-thunk";
import {AppRootStateType} from "../../../app/store";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";


const initialState: Array<TodolistDomainType> = []

const slice = createSlice({
    name: 'todoLists',
    initialState: initialState,
    reducers: {
        removeTodolistAC(state, action: PayloadAction<{ id: string }>) {
            const index = state.findIndex(el => el.id === action.payload.id)
            if (index > -1) {
                state.splice(index, 1)
            }
        },
        addTodolistAC(state, action: PayloadAction<{ todolist: TodolistType }>) {
            state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'})
        },
        changeTodolistFilterAC(state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) {
            const index = state.findIndex(el => el.id === action.payload.id)
            state[index].filter = action.payload.filter
        },
        changeTodolistTitleAC(state, action: PayloadAction<{ id: string, title: string }>) {
            const index = state.findIndex(el => el.id === action.payload.id)
            state[index].title = action.payload.title
        },
        setTodolistsAC(state, action: PayloadAction<{ todolists: Array<TodolistDomainType> }>) {
            return action.payload.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
        },
        changeTodolistEntityStatusAC(state, action: PayloadAction<{ todoListId: string, status: RequestStatusType }>) {
            const index = state.findIndex(el => el.id === action.payload.todoListId)
            state[index].entityStatus = action.payload.status
        },
        clearTodolistsAC() {
            return []
        },
    }
})

export const todolistsReducer = slice.reducer
export const {
    removeTodolistAC,
    addTodolistAC,
    changeTodolistTitleAC,
    changeTodolistFilterAC,
    clearTodolistsAC,
    changeTodolistEntityStatusAC,
    setTodolistsAC
} = slice.actions

//thunks
export const getTodolistsTC = (): ThunkAction<void, AppRootStateType, unknown, AnyAction> => (dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    todolistsApi.getTodolist()
        .then((res) => {
            dispatch(setTodolistsAC({todolists: res.data}))
            dispatch(setAppStatusAC({status: 'succeeded'}))
            return res.data
        })
        .then((todolists) => {
            todolists.forEach((tl: TodolistDomainType) => {
                dispatch(setTasksTC(tl.id))
            })
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}
export const deleteTodolistTC = (todolistId: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    dispatch(changeTodolistEntityStatusAC({todoListId: todolistId, status: 'loading'}))
    todolistsApi.deleteTodolist(todolistId)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(removeTodolistAC({id: todolistId}))
                dispatch(setAppStatusAC({status: 'succeeded'}))
            }
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}
export const createTodolistTC = (title: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    todolistsApi.createTodolist(title)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(addTodolistAC({todolist: res.data.data.item}))
                dispatch(setAppStatusAC({status: 'succeeded'}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}
export const updateTodolistTC = (todolistId: string, title: string) => (dispatch: Dispatch) => {
    todolistsApi.updateTodolist(todolistId, title)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(changeTodolistTitleAC({id: todolistId, title}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}
