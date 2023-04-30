import {TasksStateType} from "app/App";
import {
	changeTodolistEntityStatusAC,
	clearTodolistsAC,
	createTodolistTC,
	deleteTodolistTC,
	getTodolistsTC,
} from "./todolists-reducer";
import {TaskType, todolistsApi, TodolistType, UpdateTaskModelType} from "api/todolists-api";
import {AppRootStateType} from "app/store";
import {setAppStatusAC} from "app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "utils/error-utils";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";

//thunks
export const setTasksTC = createAsyncThunk('task/setTasks', async (todolistId: string, thunkAPI) => {
	thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
	const res = await todolistsApi.getTasks(todolistId)
	const tasks = res.data.items
	thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
	return {tasks, todolistId}
})
export const removeTaskTC = createAsyncThunk('task/removeTasks', async (param: { todolistId: string, taskId: string }, thunkAPI) => {
	thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
	thunkAPI.dispatch(changeTodolistEntityStatusAC({todoListId: param.todolistId, status: 'loading'}))
	try {
		await todolistsApi.deleteTask(param.todolistId, param.taskId)
		thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
		thunkAPI.dispatch(changeTodolistEntityStatusAC({todoListId: param.todolistId, status: 'succeeded'}))
		return {todolistId: param.todolistId, taskId: param.taskId}
	} catch (error: any) {
		handleServerNetworkError(error, thunkAPI.dispatch)
	}
})
export const addTasksTC = createAsyncThunk('task/addTasks', async (param: { todolistId: string, title: string }, thunkAPI) => {
	thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
	try {
		const res = await todolistsApi.createTask(param.todolistId, param.title)
		if (res.data.resultCode === 0) {
			thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
			return res.data.data.item
		} else {
			handleServerAppError(res.data, thunkAPI.dispatch)
			return thunkAPI.rejectWithValue(null)
		}
	} catch (error: any) {
		thunkAPI.dispatch(setAppStatusAC({status: 'failed'}))
		handleServerNetworkError(error, thunkAPI.dispatch)
		return thunkAPI.rejectWithValue(null)
	}
})
export const updateTaskTC = createAsyncThunk('task/updateTask', async (param: { taskId: string, model: UpdateDomainTaskModelType, todolistId: string, }, {
	dispatch,
	rejectWithValue,
	getState
}) => {
	const state = getState() as AppRootStateType;
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
		dispatch(setAppStatusAC({status: 'loading'}))
		try {
			const res = await todolistsApi.updateTask(param.todolistId, param.taskId, apiModel)
			if (res.data.resultCode === 0) {
				dispatch(setAppStatusAC({status: 'succeeded'}))
				return param
			} else {
				handleServerAppError(res.data, dispatch)
				dispatch(setAppStatusAC({status: 'failed'}))
				return rejectWithValue(null)
			}
		} catch (error: any) {
			handleServerNetworkError(error, dispatch)
			return rejectWithValue(null)
		}
	}
})

const slice = createSlice({
	name: 'task',
	initialState: {} as TasksStateType,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(createTodolistTC.fulfilled, (state, action) => {
			state[action.payload.todolist.id] = []
		})
		builder.addCase(deleteTodolistTC.fulfilled, (state, action) => {
			delete state[action.payload.id]
		})
		builder.addCase(getTodolistsTC.fulfilled, (state, action) => {
			action.payload.todolists.forEach((tl: TodolistType) => {
				state[tl.id] = []
			})
		})
		builder.addCase(setTasksTC.fulfilled, (state, action) => {
			state[action.payload.todolistId] = action.payload.tasks
		})
		builder.addCase(removeTaskTC.fulfilled, (state, action) => {
			if (action.payload) {
				const tasks = state[action.payload.todolistId]
				const index = tasks.findIndex(t => t.id === action.payload?.taskId)
				tasks.splice(index, 1)
			}
		})
		builder.addCase(addTasksTC.fulfilled, (state, action) => {
			if (action.payload) {
				state[action.payload.todoListId].unshift(action.payload)
			}
		})
		builder.addCase(updateTaskTC.fulfilled, (state, action) => {
			if (action.payload) {
				const tasks = state[action.payload.todolistId]
				const index = tasks.findIndex(t => t.id === action.payload?.taskId)
				tasks[index] = {...tasks[index], ...action.payload.model}
			}
		})
		builder.addCase(clearTodolistsAC, () => {
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

