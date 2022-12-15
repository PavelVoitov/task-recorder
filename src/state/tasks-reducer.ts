
import { TasksStateType} from "../AppWithRedux";
import {v1} from "uuid";
import {AddTodoListAT, RemoveTodoListAT} from "./todolists-reducer";

export type RemoveTaskActionType = ReturnType<typeof removeTaskAC>

type AddTaskActionType = ReturnType<typeof addTaskAC>

type changeTaskStatusActionType = ReturnType<typeof changeTaskStatusAC>

type changeTaskTitleActionType = ReturnType<typeof changeTaskTitleAC>



type ActionType = RemoveTaskActionType
    | AddTaskActionType
    | changeTaskStatusActionType
    | changeTaskTitleActionType
    | AddTodoListAT
    | RemoveTodoListAT

const initialState : TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialState, action: ActionType) : TasksStateType => {
    switch (action.type) {
        case "REMOVE-TASK":
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId)
            }
        case 'ADD-TASK':
            const newTaskId = v1()
            return {
                ...state,
               [action.todoListId]: [{id: newTaskId, title: action.title, isDone: false}, ...state[action.todoListId]],
            }
        case "CHANGE-TASK-STATUS":
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(t => t.id !== action.taskId ? t : {...t, isDone: action.isDone})
            }
        case "CHANGE-TASK-TITLE":
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(t => t.id !== action.taskId ? t : {...t, title: action.title})
            }
        case 'ADD-TODOLIST':
            return {
                ...state,
                [action.todoListId]: []
            }
        case 'REMOVE-TODOLIST':
            let copyState = {...state}
            delete copyState[action.todoListId]
            return copyState

        default:
            return state
    }
}


export const removeTaskAC = (taskId: string, todolistId: string) => {return {type: 'REMOVE-TASK', taskId, todolistId} as const}
export const addTaskAC = (title: string, todoListId: string) => {return {type: 'ADD-TASK', title, todoListId} as const}
export const changeTaskStatusAC = (taskId: string, isDone: boolean, todolistId: string) => { return {type: 'CHANGE-TASK-STATUS', taskId, isDone, todolistId} as const
}
export const changeTaskTitleAC = (taskId: string, title: string, todolistId: string) => {
    return {type: 'CHANGE-TASK-TITLE', taskId, title, todolistId} as const
}




