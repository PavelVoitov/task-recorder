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
    const [taskId, setTaskId] = useState<string>('')
    const [todolistId, setTodolistId] = useState<string>('')
    const [taskTitle, setTaskTitle] = useState<string>('')

    // useEffect(() => {
    //     todolistAPI.updateTask(todolistId, taskId, title)
    //         .then((res) => {
    //             setState(res.data)
    //         })
    // }, [])

    const updateTask = () => {
            todolistAPI.updateTask(todolistId, taskId, taskTitle)
                .then((res) => {
                    setState(res.data)
                })
    }

    return <div>{JSON.stringify(state)}
        <div>
            <input placeholder={'todolistId'} value={todolistId} onChange={(event)=> {setTodolistId(event.currentTarget.value)}}/>
            <input placeholder={'taskId'} value={taskId} onChange={(event)=> {setTaskId(event.currentTarget.value)}}/>
            <input placeholder={'New task title'} value={taskTitle} onChange={(event)=> {setTaskTitle(event.currentTarget.value)}}/>
            <button onClick={updateTask}>Update Task</button>
        </div>
    </div>
}

