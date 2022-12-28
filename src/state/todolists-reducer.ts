import {todolistAPI, TodolistType} from "../api/todolist-api";
import {Dispatch} from "redux";
type RemoveTodoListAT = ReturnType<typeof removeTodolistAC>
type AddTodoListAT = ReturnType<typeof addTodolistAC>
type ChangeTodolistFilterAT = ReturnType<typeof changeTodolistFilterAC>
type ChangeTodolistTitleAT = ReturnType<typeof changeTodolistTitleAC>
type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>

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
export const addTodolistAC = (title: string, todoListId: string) => ({type: "ADD-TODOLIST", title, todoListId} as const)
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) => {return {type: 'CHANGE-TODOLIST-FILTER', todoListId: id, filter} as const}
export const changeTodolistTitleAC = (id: string, title: string) => {return {type: 'CHANGE-TODOLIST-TITLE',todoListId: id, title} as const}
export const setTodolistsAC = (todolists: Array<TodolistDomainType>) => {return {type: 'SET-TODOLISTS', todolists} as const}

export const getTodolistsTC = () => (dispatch: Dispatch) => {
    todolistAPI.getTodolist()
        .then((res) => {
            dispatch(setTodolistsAC(res.data))
        })
}

export const deleteTodolistTC = (todolistId: string) => (dispatch: Dispatch) => {
    todolistAPI.deleteTodolist(todolistId)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(removeTodolistAC(todolistId))
            }
        })
}

export const createTodolistTC = (title: string) => (dispatch: Dispatch) => {
    todolistAPI.createTodolist(title)
        .then((res) => {
            console.log(res.data.data.item)
                dispatch(addTodolistAC(title, res.data.data.item.id))
        })
}

export const updateTodolistTC = (todolistId: string, title: string) => (dispatch: Dispatch) => {
        todolistAPI.updateTodolist(todolistId, title)
            .then(() => {
                dispatch(changeTodolistTitleAC(todolistId, title))
            })
    }


