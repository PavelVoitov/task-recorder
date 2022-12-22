import {v1} from "uuid";
import {todolistAPI, TodolistType} from "../api/todolist-api";
import {Dispatch} from "redux";
export type RemoveTodoListAT = ReturnType<typeof removeTodolistAC>
export type AddTodoListAT = ReturnType<typeof addTodolistAC>
export type ChangeTodolistFilterAT = ReturnType<typeof changeTodolistFilterAC>
export type ChangeTodolistTitleAT = ReturnType<typeof changeTodolistTitleAC>
export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
}

type ActionType = RemoveTodoListAT | AddTodoListAT | ChangeTodolistFilterAT | ChangeTodolistTitleAT | SetTodolistsActionType

const initialState : Array<TodolistDomainType> = []

export const todolistsReducer = (todoLists: Array<TodolistDomainType> = initialState, action: ActionType) : Array<TodolistDomainType> => {
    switch (action.type) {
        case "REMOVE-TODOLIST":
            return todoLists.filter(el => el.id !== action.todoListId);
        case 'ADD-TODOLIST':
            return [...todoLists,
                {
                    id: action.todoListId,
                    title: action.title,
                    filter: "all",
                    addedDate: '',
                    order: 0
                }]
        case "CHANGE-TODOLIST-FILTER":
            return todoLists.map(el => el.id === action.todoListId ? {...el, filter: action.filter} : el)
        case "CHANGE-TODOLIST-TITLE":
            return todoLists.map(el => el.id === action.todoListId ? {...el, title: action.title} : el)
        case 'SET-TODOLISTS': {
            return action.todolists.map(tl => ({
                ...tl,
                filter: 'all'
            }))
        }
        default:
            return todoLists
    }
}


export const removeTodolistAC = (id: string) => {return {type: "REMOVE-TODOLIST", todoListId: id} as const}
export const addTodolistAC = (title: string) => ({type: "ADD-TODOLIST", title, todoListId: v1()} as const)
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) => {return {type: 'CHANGE-TODOLIST-FILTER', todoListId: id, filter} as const}
export const changeTodolistTitleAC = (id: string, title: string) => {return {type: 'CHANGE-TODOLIST-TITLE',todoListId: id, title} as const}
export const setTodolistsAC = (todolists: Array<TodolistDomainType>) => {return {type: 'SET-TODOLISTS', todolists} as const}

export const getTodolistsTC = () => (dispatch: Dispatch) => {
    todolistAPI.getTodolist()
        .then((res) => {
            dispatch(setTodolistsAC(res.data))
        })
}


