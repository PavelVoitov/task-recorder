import {TasksStateType} from "../../../app/App";
import {AddTodoListAT, RemoveTodoListAT, SetTodolistsActionType} from "./todolists-reducer";
import {TaskType, todolistAPI, UpdateTaskModelType} from "../../../api/todolist-api";
import {Dispatch} from "redux";
import {AppRootStateType} from "../../../app/store";

type ActionType =
    | ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof updateTaskAC>
    // | ReturnType<typeof changeTaskTitleAC>
    | AddTodoListAT
    | RemoveTodoListAT
    | SetTodolistsActionType
    | ReturnType<typeof setTasksAC>

const initialState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialState, action: ActionType): TasksStateType => {
    switch (action.type) {
        case 'SET-TASKS': {
            return {
                ...state,
                [action.todolistId]: action.tasks
            }
        }
        case "REMOVE-TASK":
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId)
            }
        case 'ADD-TASK':
        return {
            ...state,
            [action.newTask.todoListId]: [action.newTask, ...state[action.newTask.todoListId]],
        }
        case "UPDATE-TASK":
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(t => t.id !== action.taskId ? t : {
                    ...t, ...action.model
                })
            }
        // case "CHANGE-TASK-TITLE":
        //     return {
        //         ...state,
        //         [action.todolistId]: state[action.todolistId].map(t => t.id !== action.taskId ? t : {
        //             ...t,
        //             title: action.title
        //         })
        //     }
        case 'ADD-TODOLIST':
            return {
                ...state,
                [action.todolist.id]: []
            }
        case 'REMOVE-TODOLIST': {
            let copyState = {...state}
            delete copyState[action.todoListId]
            return copyState;
        }
        case 'SET-TODOLISTS': {
            const copyState = {...state}
            action.todolists.forEach((tl) => {
                copyState[tl.id] = []
            })
            return copyState
        }
        default:
            return state
    }
}

// actions
export const removeTaskAC = (todolistId: string, taskId: string) => ({type: 'REMOVE-TASK', todolistId, taskId} as const)
export const addTaskAC = (newTask: TaskType) => ({type: 'ADD-TASK', newTask} as const)
export const updateTaskAC = (taskId: string, model: UpdateDomainTaskModelType, todolistId: string) => (
    {type: "UPDATE-TASK", taskId, model, todolistId} as const)
// export const changeTaskTitleAC = (taskId: string, title: string, todolistId: string) => (
//     {type: 'CHANGE-TASK-TITLE', taskId, title, todolistId} as const)
export const setTasksAC = (tasks: Array<TaskType>, todolistId: string) => (
    {
        type: 'SET-TASKS',
        tasks,
        todolistId

    } as const)


// thunks
export const setTasksTC = (todolistId: string) => (dispatch: Dispatch<ActionType>) => {
    todolistAPI.getTasks(todolistId)
        .then((res) => {
            const tasks = res.data.items
            dispatch(setTasksAC(tasks, todolistId))
        })
}
export const removeTasksTC = (todolistId: string, taskId: string) => (dispatch: Dispatch<ActionType>) => {
    todolistAPI.deleteTask(todolistId, taskId)
        .then(() => {
            dispatch(removeTaskAC(todolistId, taskId,))
        })
}
export const addTasksTC = (todolistId: string, title: string) => (dispatch: Dispatch<ActionType>) => {
    todolistAPI.createTask(todolistId, title)
        .then((res) => {
            dispatch(addTaskAC(res.data.data.item))
        })
}

export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: number
    priority?: number
    startDate?: string
    deadline?: string
}

export const updateTaskTC = (todolistId: string, taskId: string, domainModel: UpdateDomainTaskModelType) => (dispatch: Dispatch<ActionType>, getState: () => AppRootStateType) => {
    const tasks = getState().tasks
    const task = tasks[todolistId].find(t => t.id === taskId)
    if (task) {
        const apiModel: UpdateTaskModelType = {
            title: task.title,
            deadline: task.deadline,
            startDate: task.startDate,
            description: task.description,
            status: task.status,
            priority: task.priority,
            ...domainModel
        }
        todolistAPI.updateTask(todolistId, taskId, apiModel)
            .then(() => {
                dispatch(updateTaskAC(taskId, domainModel, todolistId))
            })
    }
}




