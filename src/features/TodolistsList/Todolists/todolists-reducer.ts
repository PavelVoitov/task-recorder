import {todolistAPI, TodolistType} from "../../../api/todolist-api";
import {Dispatch} from "redux";

export type RemoveTodoListAT = ReturnType<typeof removeTodolistAC>
export type AddTodoListAT = ReturnType<typeof addTodolistAC>
export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
}

type ActionType =
    | RemoveTodoListAT
    | AddTodoListAT
    | ReturnType<typeof changeTodolistFilterAC>
    | ReturnType<typeof changeTodolistTitleAC>
    | SetTodolistsActionType

const initialState: Array<TodolistDomainType> = []

export const todolistsReducer = (todoLists: Array<TodolistDomainType> = initialState, action: ActionType): Array<TodolistDomainType> => {
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
        case 'SET-TODOLISTS':
            return action.todolists.map(tl => ({ ...tl, filter: 'all'}))
        default:
            return todoLists
    }
}

export const removeTodolistAC = (id: string) =>
    ({type: "REMOVE-TODOLIST", todoListId: id} as const)
export const addTodolistAC = (title: string, todoListId: string) =>
    ({type: "ADD-TODOLIST", title, todoListId} as const)
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) =>
    ({type: 'CHANGE-TODOLIST-FILTER', todoListId: id, filter} as const)
export const changeTodolistTitleAC = (id: string, title: string) =>
    ({type: 'CHANGE-TODOLIST-TITLE', todoListId: id, title} as const)
export const setTodolistsAC = (todolists: Array<TodolistDomainType>) =>
    ({type: 'SET-TODOLISTS', todolists} as const)



//thunks
export const getTodolistsTC = () => (dispatch: Dispatch<ActionType>) => {
    todolistAPI.getTodolist()
        .then((res) => {
            console.log(res.data)
            dispatch(setTodolistsAC(res.data))
        })
}
export const deleteTodolistTC = (todolistId: string) => (dispatch: Dispatch<ActionType>) => {
    todolistAPI.deleteTodolist(todolistId)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(removeTodolistAC(todolistId))
            }
        })
}
export const createTodolistTC = (title: string) => (dispatch: Dispatch<ActionType>) => {
    todolistAPI.createTodolist(title)
        .then((res) => {
            console.log(res.data.data.item)
            dispatch(addTodolistAC(title, res.data.data.item.id))
        })
}
export const updateTodolistTC = (todolistId: string, title: string) => (dispatch: Dispatch<ActionType>) => {
    todolistAPI.updateTodolist(todolistId, title)
        .then(() => {
            dispatch(changeTodolistTitleAC(todolistId, title))
        })
}


