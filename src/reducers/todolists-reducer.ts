
import {FilterValuesType, TodoListType} from "../App";
import {v1} from "uuid";

type RemoveTodoListAT = {
    type: 'REMOVE-TODOLIST'
    todoListId: string
}

type AddTodoListAT = {
    type: 'ADD-TODOLIST'
    title: string
}

type ChangeTodoFilterAT = {
    type: 'CHANGE-TODOLIST-FILTER'
    filter: FilterValuesType
    todoListId: string
}

type ChangeTodoTitleAT = {
    type: 'CHANGE-TODOLIST-TITLE'
    title: string
    todoListId: string
}

type ActionType = RemoveTodoListAT | AddTodoListAT | ChangeTodoFilterAT | ChangeTodoTitleAT

export const todolistsReducer = (todoLists: Array<TodoListType>, action: ActionType) : Array<TodoListType> => {
    switch (action.type) {
        case "REMOVE-TODOLIST":
            return todoLists.filter(el => el.id !== action.todoListId);
        case 'ADD-TODOLIST':
            const newTodoListId = v1();
            return [...todoLists, {id: newTodoListId, title: action.title, filter: "all"}]
        case "CHANGE-TODOLIST-FILTER":
            return todoLists.map(el => el.id === action.todoListId ? {...el, filter: action.filter} : el)
        case "CHANGE-TODOLIST-TITLE":
            return todoLists.map(el => el.id === action.todoListId ? {...el, title: action.title} : el)

        default:
            return todoLists
    }
}


export const RemoveTodoListAC = (id: string): RemoveTodoListAT => ({type: "REMOVE-TODOLIST", todoListId: id})
export const AddTodoListAC = (title: string): AddTodoListAT => ({type: "ADD-TODOLIST", title})
export const ChangeTodoFilterAC = (id: string, filter: FilterValuesType): ChangeTodoFilterAT => ({type: 'CHANGE-TODOLIST-FILTER', todoListId: id, filter})
export const ChangeTodoTitleAC = (title: string, id: string): ChangeTodoTitleAT => ({type: 'CHANGE-TODOLIST-TITLE', title, todoListId: id})


