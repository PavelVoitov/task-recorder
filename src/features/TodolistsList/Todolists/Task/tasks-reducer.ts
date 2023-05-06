import {TasksStateType} from "app/App";
import {clearTodolists,} from "features/TodolistsList/Todolists/todolists-reducer";
import {TodolistType} from "api/todolists-api";
import {createSlice} from "@reduxjs/toolkit";
import {addTask, removeTask, setTasks, updateTask} from "features/TodolistsList/Todolists/Task/tasks-actions";
import {createTodolist, deleteTodolist, getTodolists} from "features/TodolistsList/Todolists/todolists-actions";

const slice = createSlice({
	name: 'task',
	initialState: {} as TasksStateType,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(createTodolist.fulfilled, (state, action) => {
			state[action.payload.todolist.id] = []
		})
		builder.addCase(deleteTodolist.fulfilled, (state, action) => {
			delete state[action.payload.id]
		})
		builder.addCase(getTodolists.fulfilled, (state, action) => {
			action.payload.todolists.forEach((tl: TodolistType) => {
				state[tl.id] = []
			})
		})
		builder.addCase(setTasks.fulfilled, (state, action) => {
			state[action.payload.todolistId] = action.payload.tasks
		})
		builder.addCase(removeTask.fulfilled, (state, action) => {
			if (action.payload) {
				const tasks = state[action.payload.todolistId]
				const index = tasks.findIndex(t => t.id === action.payload?.taskId)
				tasks.splice(index, 1)
			}
		})
		builder.addCase(addTask.fulfilled, (state, action) => {
			if (action.payload) {
				state[action.payload.todoListId].unshift(action.payload)
			}
		})
		builder.addCase(updateTask.fulfilled, (state, action) => {
			if (action.payload) {
				const tasks = state[action.payload.todolistId]
				const index = tasks.findIndex(t => t.id === action.payload?.taskId)
				tasks[index] = {...tasks[index], ...action.payload.model}
			}
		})
		builder.addCase(clearTodolists, () => {
			return {}
		})
	}
})

export const tasksReducer = slice.reducer

//types
export type UpdateDomainTaskModelType = {
	title?: string
	description?: string
	status?: number
	priority?: number
	startDate?: string
	deadline?: string
}

