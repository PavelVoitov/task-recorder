
import {FilterValuesType, TodolistType} from "../AppWithRedux";
import {v1} from "uuid";

export type RemoveTodoListAT = ReturnType<typeof removeTodolistAC>
//     {
//     type: 'REMOVE-TODOLIST'
//     todoListId: string
// }

export type AddTodoListAT = ReturnType<typeof addTodolistAC>
//     {
//     type: 'ADD-TODOLIST'
//     title: string
//     todoListId: string
// }

type ChangeTodoFilterAT = ReturnType<typeof changeTodolistFilterAC>
//     {
//     type: 'CHANGE-TODOLIST-FILTER'
//     filter: FilterValuesType
//     todoListId: string
// }

type ChangeTodoTitleAT = ReturnType<typeof changeTodolistTitleAC>
//     {
//     type: 'CHANGE-TODOLIST-TITLE'
//     title: string
//     todoListId: string
// }

type ActionType = RemoveTodoListAT | AddTodoListAT | ChangeTodoFilterAT | ChangeTodoTitleAT

const initialState : Array<TodolistType> = []

export const todolistsReducer = (todoLists: Array<TodolistType> = initialState, action: ActionType) : Array<TodolistType> => {
    switch (action.type) {
        case "REMOVE-TODOLIST":
            return todoLists.filter(el => el.id !== action.todoListId);
        case 'ADD-TODOLIST':
            return [...todoLists, {id: action.todoListId, title: action.title, filter: "all"}]
        case "CHANGE-TODOLIST-FILTER":
            return todoLists.map(el => el.id === action.todoListId ? {...el, filter: action.filter} : el)
        case "CHANGE-TODOLIST-TITLE":
            return todoLists.map(el => el.id === action.todoListId ? {...el, title: action.title} : el)
        default:
            return todoLists
    }
}


export const removeTodolistAC = (id: string) => {return {type: "REMOVE-TODOLIST", todoListId: id} as const}
export const addTodolistAC = (title: string) => ({type: "ADD-TODOLIST", title, todoListId: v1()} as const)
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) => {return {type: 'CHANGE-TODOLIST-FILTER', todoListId: id, filter} as const}
export const changeTodolistTitleAC = (id: string, title: string,) => {return {type: 'CHANGE-TODOLIST-TITLE',todoListId: id, title} as const}


