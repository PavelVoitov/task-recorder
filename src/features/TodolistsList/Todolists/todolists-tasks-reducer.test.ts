import {TasksStateType} from "app/App";
import {tasksReducer} from "./tasks-reducer";
import {todolistsReducer, TodolistDomainType, createTodolistTC} from "./todolists-reducer";


test('ids should be equals', () => {
    const startTasksState: TasksStateType = {}
    const startTodolistsState: Array<TodolistDomainType> = []

    const action = createTodolistTC.fulfilled({todolist: {id: '1', title: 'new todolist', addedDate: "", order: 0}}, "requireId", 'new todolist')

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodolistsState = todolistsReducer(startTodolistsState, action)

    const keys = Object.keys(endTasksState)
    const idFromTasks = keys[0]
    const idFromTodolists = endTodolistsState[0].id

    expect(idFromTasks).toBe(action.payload.todolist.id)
    expect(idFromTodolists).toBe(action.payload.todolist.id)
})