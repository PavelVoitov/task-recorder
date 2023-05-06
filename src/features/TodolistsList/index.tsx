import * as tasksActions from './Todolists/Task/tasks-actions'
import * as todolistsAsyncActions from './Todolists/todolists-actions'
import {slice} from "features/TodolistsList/Todolists/todolists-reducer";
import {TodolistsList} from './TodolistsList'

const todolistsActions = {
	...todolistsAsyncActions,
	...slice.actions
}

export {
	tasksActions,
	todolistsActions,
	TodolistsList
}