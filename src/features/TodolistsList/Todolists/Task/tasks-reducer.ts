import {TasksStateType} from "app/App";
import {TaskType, todolistsApi, TodolistType, UpdateTaskModelType} from "api/todolists-api";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {handleAsyncServerAppError, handleAsyncServerNetworkError} from "utils/error-utils";
import {AppRootStateType, ThunkError} from "utils/types";
import {appActions} from "features/CommonActions/App";
import {
	changeTodolistEntityStatusAction,
	asyncTodolistsActions,
	clearTodolists
} from "features/TodolistsList/Todolists/todolists-reducer";

const {setAppStatus} = appActions

//thunks
export const setTasks = createAsyncThunk<{ tasks: TaskType[], todolistId: string }, string, ThunkError>('task/setTasks',
	async (todolistId: string, thunkAPI) => {
		thunkAPI.dispatch(setAppStatus({status: 'loading'}))
		try {
			const res = await todolistsApi.getTasks(todolistId)
			const tasks = res.data.items
			thunkAPI.dispatch(setAppStatus({status: 'succeeded'}))
			return {tasks, todolistId}
		} catch (e: any) {
			return handleAsyncServerNetworkError(e, thunkAPI)
		}
	})
export const removeTask = createAsyncThunk<{ taskId: string, todolistId: string }, { todolistId: string, taskId: string }, ThunkError>('task/removeTasks',
	async (param, thunkAPI) => {
		thunkAPI.dispatch(setAppStatus({status: 'loading'}))
		thunkAPI.dispatch(changeTodolistEntityStatusAction({todoListId: param.todolistId, status: 'loading'}))
		try {
			await todolistsApi.deleteTask(param.todolistId, param.taskId)
			thunkAPI.dispatch(setAppStatus({status: 'succeeded'}))
			thunkAPI.dispatch(changeTodolistEntityStatusAction({todoListId: param.todolistId, status: 'succeeded'}))
			return {todolistId: param.todolistId, taskId: param.taskId}
		} catch (error: any) {
			return handleAsyncServerNetworkError(error, thunkAPI)
		}
	})
export const addTask = createAsyncThunk<TaskType, { todolistId: string, title: string },
	ThunkError>('task/addTasks', async (param, thunkAPI) => {
	thunkAPI.dispatch(setAppStatus({status: 'loading'}))
	try {
		const res = await todolistsApi.createTask(param.todolistId, param.title)
		if (res.data.resultCode === 0) {
			thunkAPI.dispatch(setAppStatus({status: 'succeeded'}))
			return res.data.data.item
		} else {
			return handleAsyncServerAppError(res.data, thunkAPI, false)
		}
	} catch (error: any) {
		return handleAsyncServerNetworkError(error, thunkAPI)
	}
})
export const updateTask = createAsyncThunk('task/updateTask',
	async (param: { taskId: string, model: UpdateDomainTaskModelType, todolistId: string, }, thunkAPI) => {
		const state = thunkAPI.getState() as AppRootStateType;
		const tasks = state.tasks
		const task = tasks[param.todolistId].find((t: TaskType) => t.id === param.taskId)
		if (task) {
			const apiModel: UpdateTaskModelType = {
				title: task.title,
				deadline: task.deadline,
				startDate: task.startDate,
				description: task.description,
				status: task.status,
				priority: task.priority,
				...param.model
			}
			thunkAPI.dispatch(appActions.setAppStatus({status: 'loading'}))
			try {
				const res = await todolistsApi.updateTask(param.todolistId, param.taskId, apiModel)
				if (res.data.resultCode === 0) {
					thunkAPI.dispatch(appActions.setAppStatus({status: 'succeeded'}))
					return param
				} else {
					thunkAPI.dispatch(appActions.setAppStatus({status: 'failed'}))
					return handleAsyncServerAppError(res.data, thunkAPI)
				}
			} catch (error: any) {
				return handleAsyncServerNetworkError(error, thunkAPI)
			}
		}
	})

export const asyncTasksActions = {
	setTasks,
	removeTask,
	addTask,
	updateTask
}

export const slice = createSlice({
	name: 'task',
	initialState: {} as TasksStateType,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(asyncTodolistsActions.addTodolist.fulfilled, (state, action) => {
				state[action.payload.todolist.id] = []
			})
			.addCase(asyncTodolistsActions.deleteTodolist.fulfilled, (state, action) => {
				delete state[action.payload.id]
			})
			.addCase(asyncTodolistsActions.getTodolists.fulfilled, (state, action) => {
				action.payload.todolists.forEach((tl: TodolistType) => {
					state[tl.id] = []
				})
			})
			.addCase(setTasks.fulfilled, (state, action) => {
				state[action.payload.todolistId] = action.payload.tasks
			})
			.addCase(removeTask.fulfilled, (state, action) => {
				if (action.payload) {
					const tasks = state[action.payload.todolistId]
					const index = tasks.findIndex(t => t.id === action.payload?.taskId)
					tasks.splice(index, 1)
				}
			})
			.addCase(addTask.fulfilled, (state, action) => {
				if (action.payload) {
					state[action.payload.todoListId].unshift(action.payload)
				}
			})
			.addCase(updateTask.fulfilled, (state, action) => {
				if (action.payload) {
					const tasks = state[action.payload.todolistId]
					const index = tasks.findIndex(t => t.id === action.payload?.taskId)
					tasks[index] = {...tasks[index], ...action.payload.model}
				}
			})
			.addCase(clearTodolists, () => {
				return {}
			})
	}
})

//types
export type UpdateDomainTaskModelType = {
	title?: string
	description?: string
	status?: number
	priority?: number
	startDate?: string
	deadline?: string
}

