import {createAsyncThunk} from "@reduxjs/toolkit";
import {setAppStatusAC} from "app/app-reducer";
import {changeTodolistEntityStatusAction} from "features/TodolistsList/Todolists/todolists-reducer";
import {TaskType, todolistsApi, UpdateTaskModelType} from "api/todolists-api";
import {handleServerAppError, handleServerNetworkError} from "utils/error-utils";
import {AppRootStateType} from "app/store";
import {UpdateDomainTaskModelType} from "features/TodolistsList/Todolists/Task/tasks-reducer";

//thunks
export const setTasks = createAsyncThunk('task/setTasks', async (todolistId: string, thunkAPI) => {
	thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
	const res = await todolistsApi.getTasks(todolistId)
	const tasks = res.data.items
	thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
	return {tasks, todolistId}
})
export const removeTask = createAsyncThunk('task/removeTasks', async (param: { todolistId: string, taskId: string }, thunkAPI) => {
	thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
	thunkAPI.dispatch(changeTodolistEntityStatusAction({todoListId: param.todolistId, status: 'loading'}))
	try {
		await todolistsApi.deleteTask(param.todolistId, param.taskId)
		thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
		thunkAPI.dispatch(changeTodolistEntityStatusAction({todoListId: param.todolistId, status: 'succeeded'}))
		return {todolistId: param.todolistId, taskId: param.taskId}
	} catch (error: any) {
		handleServerNetworkError(error, thunkAPI.dispatch)
	}
})
export const addTask = createAsyncThunk('task/addTasks', async (param: { todolistId: string, title: string }, thunkAPI) => {
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
export const updateTask = createAsyncThunk('task/updateTask', async (param: { taskId: string, model: UpdateDomainTaskModelType, todolistId: string, }, {
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