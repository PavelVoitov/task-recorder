import {asyncTasksActions as tasksAsyncActions} from './Todolists/Task/tasks-reducer'
import {asyncTodolistsActions as todolistsAsyncActions} from './Todolists/todolists-reducer'
import {slice as todolistsSlice} from "features/TodolistsList/Todolists/todolists-reducer";
import {slice as tasksSlice} from './Todolists/Task/tasks-reducer'
import {TodolistsList} from './TodolistsList'

const todolistsActions = {
	...todolistsAsyncActions,
	...todolistsSlice.actions
}

const tasksActions = {
	...tasksAsyncActions,
}

const todolistsReducer = todolistsSlice.reducer
const tasksReducer = tasksSlice.reducer

export {
	tasksActions,
	todolistsActions,
	TodolistsList,
	todolistsReducer,
	tasksReducer
}