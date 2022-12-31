import {todolistAPI, TodolistType} from "../../../api/todolist-api";
import {Dispatch} from "redux";
import {RequestStatusType, setAppStatusAC, SetStatusType} from "../../../app/app-reducer";

export type RemoveTodoListAT = ReturnType<typeof removeTodolistAC>
export type AddTodoListAT = ReturnType<typeof addTodolistAC>
export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}

type ActionType =
    | RemoveTodoListAT
    | AddTodoListAT
    | ReturnType<typeof changeTodolistFilterAC>
    | ReturnType<typeof changeTodolistTitleAC>
    | SetTodolistsActionType
    | SetStatusType
    | ReturnType<typeof changeTodolistEntityStatusAC>

const initialState: Array<TodolistDomainType> = []

export const todolistsReducer = (todoLists: Array<TodolistDomainType> = initialState, action: ActionType): Array<TodolistDomainType> => {
    switch (action.type) {
        case "REMOVE-TODOLIST":
            return todoLists.filter(el => el.id !== action.todoListId);
        case 'ADD-TODOLIST':
            return [{...action.todolist, filter: 'all', entityStatus: 'idle'}, ...todoLists]
        case "CHANGE-TODOLIST-FILTER":
            return todoLists.map(el => el.id === action.todoListId ? {...el, filter: action.filter} : el)
        case "CHANGE-TODOLIST-TITLE":
            return todoLists.map(el => el.id === action.todoListId ? {...el, title: action.title} : el)
        case 'CHANGE-TODOLIST-ENTITY-STATUS':
            return todoLists.map(el => el.id === action.todoListId ? {...el, entityStatus: action.status} : el)
        case 'SET-TODOLISTS':
            return action.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
        default:
            return todoLists
    }
}

export const removeTodolistAC = (id: string) =>
    ({type: "REMOVE-TODOLIST", todoListId: id} as const)
export const addTodolistAC = (todolist: TodolistType) =>
    ({type: "ADD-TODOLIST", todolist} as const)
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) =>
    ({type: 'CHANGE-TODOLIST-FILTER', todoListId: id, filter} as const)
export const changeTodolistTitleAC = (id: string, title: string) =>
    ({type: 'CHANGE-TODOLIST-TITLE', todoListId: id, title} as const)
export const setTodolistsAC = (todolists: Array<TodolistDomainType>) =>
    ({type: 'SET-TODOLISTS', todolists} as const)
export const changeTodolistEntityStatusAC = (todoListId: string, status: RequestStatusType) =>
    ({type: 'CHANGE-TODOLIST-ENTITY-STATUS', todoListId, status} as const)


//thunks
export const getTodolistsTC = () => (dispatch: Dispatch<ActionType>) => {
    dispatch(setAppStatusAC('loading'))
    todolistAPI.getTodolist()
        .then((res) => {
            dispatch(setTodolistsAC(res.data))
            dispatch(setAppStatusAC('succeeded'))
        })
}
export const deleteTodolistTC = (todolistId: string) => (dispatch: Dispatch<ActionType>) => {
    dispatch(setAppStatusAC('loading'))
    dispatch(changeTodolistEntityStatusAC(todolistId, 'loading'))
    todolistAPI.deleteTodolist(todolistId)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(removeTodolistAC(todolistId))
                dispatch(setAppStatusAC('succeeded'))
            }
        })
}
export const createTodolistTC = (title: string) => (dispatch: Dispatch<ActionType>) => {
    dispatch(setAppStatusAC('loading'))
    todolistAPI.createTodolist(title)
        .then((res) => {
            dispatch(addTodolistAC(res.data.data.item))
            dispatch(setAppStatusAC('succeeded'))
        })
}
export const updateTodolistTC = (todolistId: string, title: string) => (dispatch: Dispatch<ActionType>) => {
    todolistAPI.updateTodolist(todolistId, title)
        .then(() => {
            dispatch(changeTodolistTitleAC(todolistId, title))
        })
}


