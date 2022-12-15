import axios from 'axios'



const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        // Не забываем заменить API-KEY на собственный
        'API-KEY': '751c0e4a-d144-43ff-8601-b34ce7e94bd1',
    },
})

export const todolistAPI = {
    getTodolist() {
        return instance.get('todo-lists')
    },
    createTodolist(title: string) {
        return instance.post<ResponseType<{item: TodolistType}>>('todo-lists', {title})
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
        return instance.post<ResponseType<TaskType>>(`todo-lists/${todolistId}/tasks`,
            {title})
    },
    deleteTask(todolistId: string, taskId: string) {
        return instance.delete<ResponseType>(
            `todo-lists/${todolistId}/tasks/${taskId}`)
    },
    updateTask(todolistId: string, taskId: string,
               // model: UpdateTaskModelType,
               title: string) {
        return instance.put<ResponseType>(
            `todo-lists/${todolistId}/tasks/${taskId}`,
            {title}
        )
    },
}

export type TaskType = {
    description: string
    title: string
    completed: boolean
    status: number
    priority: number
    startDate: Date
    deadline: Date
    id: string
    todoListId: string
    order: number
    addedDate: Date
}

type TasksResponse = {
    error: string | null
    totalCount: number
    items: TaskType[]

}

type TodolistType = {
    id: string
    title: string
    addedDate: Date
    order: number
}

type ResponseType<T = {}> = {
    fieldsErrors: string[]
    resultCode: number
    messages: string[]
    data: T
}

type UpdateTaskModelType = {
    title: string
    description: string
    completed: boolean
    status: number
    priority: number
    startDate: Date
    deadline: Date
}
