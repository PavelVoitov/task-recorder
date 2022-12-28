import axios, { AxiosResponse } from 'axios'

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        // Не забываем заменить API-KEY на собственный
        'API-KEY': '751c0e4a-d144-43ff-8601-b34ce7e94bd1',
    },
})

// api
export const todolistAPI = {
    getTodolist() {
        return instance.get('todo-lists')
    },
    createTodolist(title: string) {
        return instance.post<ResponseType<{ item: TodolistType }>>('todo-lists', {title})
    },
    deleteTodolist(todolistId: string) {
        return instance.delete<ResponseType>(
            `todo-lists/${todolistId}`)
    },
    updateTodolist(todolistId: string, title: string) {
        return instance.put<ResponseType>(
            `todo-lists/${todolistId}`,
            {title: title}
        )
    },
    getTasks(todolistId: string) {
        return instance.get<TasksResponse>(`todo-lists/${todolistId}/tasks`)
    },
    createTask(todolistId: string, title: string) {
        return instance.post<{ title: string }, AxiosResponse<ResponseType<{ item: TaskType }>>>(`todo-lists/${todolistId}/tasks`,
            {title})
    },
    deleteTask(todolistId: string, taskId: string) {
        return instance.delete<ResponseType>(
            `todo-lists/${todolistId}/tasks/${taskId}`)
    },
    updateTaskStatus(todolistId: string, taskId: string,
                     model: UpdateTaskModelType) {
        return instance.put<ResponseType>(
            `todo-lists/${todolistId}/tasks/${taskId}`,
            model
        )
    },
    updateTaskTitle(taskId: string, title: string, todolistId: string) {
        return instance.put<ResponseType>(
            `todo-lists/${todolistId}/tasks/${taskId}`,
            {title: title}
        )
    },

}

// types
export enum TaskStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3
}
export enum TaskPriorities {
    Low = 0,
    Middle = 1,
    Hi = 2,
    Urgently = 3,
    Later = 4
}
export type TaskType = {
    description: string
    title: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
}
type TasksResponse = {
    error: string | null
    totalCount: number
    items: TaskType[]

}
export type TodolistType = {
    id: string
    title: string
    addedDate: ''
    order: number
}
export type ResponseType<T = {}> = {
    fieldsErrors: string[]
    resultCode: number
    messages: string[]
    data: T
}
export type UpdateTaskModelType = {
    title: string
    description: string
    // completed: boolean
    status: number
    priority: number
    startDate: string
    deadline: string
}
