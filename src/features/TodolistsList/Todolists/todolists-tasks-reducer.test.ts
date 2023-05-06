import {TasksStateType} from "app/App";
import {tasksReducer} from "features/TodolistsList/Todolists/Task/tasks-reducer";
import {todolistsReducer, TodolistDomainType} from "./todolists-reducer";
import {createTodolist} from "features/TodolistsList/Todolists/todolists-actions";


test('ids should be equals', () => {
    const startTasksState: TasksStateType = {}
    const startTodolistsState: Array<TodolistDomainType> = []

    const action = createTodolist.fulfilled({todolist: {id: '1', title: 'new todolist', addedDate: "", order: 0}}, "requireId", 'new todolist')

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodolistsState = todolistsReducer(startTodolistsState, action)

    const keys = Object.keys(endTasksState)
    const idFromTasks = keys[0]
    const idFromTodolists = endTodolistsState[0].id

    expect(idFromTasks).toBe(action.payload.todolist.id)
    expect(idFromTodolists).toBe(action.payload.todolist.id)
})