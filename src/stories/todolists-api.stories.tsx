import React, {useEffect, useState} from 'react'
import {todolistAPI} from "../api/todolist-api";

export default {
    title: 'API',
}

export const GetTodolists = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        todolistAPI.getTodolist()
            .then((res) => {
                setState(res.data)
            })

    }, [])
    return <div>{JSON.stringify(state)}</div>
}
export const CreateTodolist = () => {
    const [state, setState] = useState<any>(null)
    const title = 'test title'
    useEffect(() => {
        todolistAPI.createTodolist(title)
            .then((res) => {
                setState(res.data)
            })

    }, [])

    return <div>{JSON.stringify(state)}</div>
}
export const DeleteTodolist = () => {
    const [state, setState] = useState<any>(null)
    const todolistId = '6d400275-a831-476f-8ec2-0d26a3f1fb1b'
    useEffect(() => {
        todolistAPI.deleteTodolist(todolistId)
            .then((res) => {
                setState(res.data)
            })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}
export const UpdateTodolistTitle = () => {
    const [state, setState] = useState<any>(null)
    const title = 'React'
    const todoId = '098e43b9-121c-4741-9a7e-abfcc4a3727d'
    useEffect(() => {
        todolistAPI.updateTodolist(todoId, title)
            .then((res) => {
                setState(res.data)
            })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}

export const GetTasks = () => {
    const [state, setState] = useState<any>(null)
    const [todolistId, setTodolistId] = useState<string>('')

    const getTask = () => {
        todolistAPI.getTasks(todolistId)
            .then((res) => {
                setState(res.data)
            })
    }

    return <div>{JSON.stringify(state)}
        <div>
            <input placeholder={'todolistId'} value={todolistId} onChange={(event)=> {setTodolistId(event.currentTarget.value)}}/>
            <button onClick={getTask}>Get Task</button>
        </div>
    </div>
}

export const CreateTask = () => {
    const [state, setState] = useState<any>(null)
    const [taskTitle, setTaskTitle] = useState<string>('')
    const [todolistId, setTodolistId] = useState<string>('')

    const createTask = () => {
        todolistAPI.createTask(todolistId, taskTitle)
            .then((res) => {
                setState(res.data)
            })
    }

    return <div>{JSON.stringify(state)}
        <div>
            <input placeholder={'todolistId'} value={todolistId} onChange={(event)=> {setTodolistId(event.currentTarget.value)}}/>
            <input placeholder={'task title'} value={taskTitle} onChange={(event)=> {setTaskTitle(event.currentTarget.value)}}/>
            <button onClick={createTask}>Create Task</button>
        </div>
    </div>
}

export const DeleteTask = () => {
    const [state, setState] = useState<any>(null)
    const [taskId, setTaskId] = useState<string>('')
    const [todolistId, setTodolistId] = useState<string>('')

    const deleteTask = () => {
            todolistAPI.deleteTask(todolistId, taskId)
                .then((res) => {
                    setState(res.data)
                })
    }
    return <div>{JSON.stringify(state)}
        <div>
            <input placeholder={'todolistId'} value={todolistId} onChange={(event)=> {setTodolistId(event.currentTarget.value)}}/>
            <input placeholder={'taskId'} value={taskId} onChange={(event)=> {setTaskId(event.currentTarget.value)}}/>
            <button onClick={deleteTask}>Delete Task</button>
        </div>
    </div>
}

export const UpdateTaskTitle = () => {
    const [state, setState] = useState<any>(null)
    const [title, setTaskTitle] = useState<string>('')
    const [description, setDescription] = useState<string>('description 1')
    const [status, setStatus] = useState<number>(0)
    const [priority, setPriority] = useState<number>(0)

    const [todolistId, setTodolistId] = useState<string>('')
    const [taskId, setTaskId] = useState<string>('')


    const updateTask = () => {
            todolistAPI.updateTask(todolistId, taskId, {
                title,
                description,
                status,
                priority,
                startDate: '',
                deadline: '',
            })
                .then((res) => {
                    setState(res.data)
                })
    }

    return <div>{JSON.stringify(state)}
        <div>
            <input placeholder={'taskId'} value={taskId} onChange={(event)=> {setTaskId(event.currentTarget.value)}}/>
            <input placeholder={'todolistId'} value={todolistId} onChange={(event)=> {setTodolistId(event.currentTarget.value)}}/>
            <input placeholder={'Task title'} value={title} onChange={(event)=> {setTaskTitle(event.currentTarget.value)}}/>
            <input placeholder={'Description'} value={description} onChange={(event)=> {setDescription(event.currentTarget.value)}}/>
            <input placeholder={'status'} type={"number"} value={status} onChange={(event)=> {setStatus(+event.currentTarget.value)}}/>
            <input placeholder={'priority'} type={"number"} value={priority} onChange={(event)=> {setPriority(+event.currentTarget.value)}}/>
            <button onClick={updateTask}>Update Task</button>
        </div>
    </div>
}

