import {createAsyncThunk} from "@reduxjs/toolkit";
import {setAppStatusAC} from "app/app-reducer";
import {todolistsApi} from "api/todolists-api";
import {handleServerAppError, handleServerNetworkError} from "utils/error-utils";
import {setTasks} from "features/TodolistsList/Todolists/Task/tasks-actions";
import {changeTodolistEntityStatusAction, TodolistDomainType} from "features/TodolistsList/Todolists/todolists-reducer";

//thunks
export const getTodolists = createAsyncThunk('todoLists/getTodolists', async (param, {dispatch, rejectWithValue}) => {
	dispatch(setAppStatusAC({status: 'loading'}))
	try {
		const res = await todolistsApi.getTodolist()
		dispatch(setAppStatusAC({status: 'succeeded'}))
		const todolists = res.data
		todolists.forEach((tl: TodolistDomainType) => {
			dispatch(setTasks(tl.id))
		})
		return {todolists: res.data}
	} catch (error: any) {
		handleServerNetworkError(error, dispatch)
		return rejectWithValue(null)
	}
})
export const deleteTodolist = createAsyncThunk('todoLists/deleteTodolist', async (todolistId: string, {
	dispatch,
	rejectWithValue
}) => {
	dispatch(setAppStatusAC({status: 'loading'}))
	dispatch(changeTodolistEntityStatusAction({todoListId: todolistId, status: 'loading'}))
	try {
		const res = await todolistsApi.deleteTodolist(todolistId)
		if (res.data.resultCode === 0) {
			dispatch(setAppStatusAC({status: 'succeeded'}))
			return {id: todolistId}
		} else {
			handleServerAppError(res.data, dispatch)
			return rejectWithValue(null)
		}
	} catch (error: any) {
		handleServerNetworkError(error, dispatch)
		return rejectWithValue(null)
	}
})
export const createTodolist = createAsyncThunk('todoLists/createTodolist', async (title: string, {
	dispatch,
	rejectWithValue
}) => {
	dispatch(setAppStatusAC({status: 'loading'}))
	try {
		const res = await todolistsApi.createTodolist(title)
		if (res.data.resultCode === 0) {
			dispatch(setAppStatusAC({status: 'succeeded'}))
			return {todolist: res.data.data.item}
		} else {
			handleServerAppError(res.data, dispatch)
			return rejectWithValue(null)
		}
	} catch (error: any) {
		handleServerNetworkError(error, dispatch)
		return rejectWithValue(null)
	}
})
export const changeTodolistTitle = createAsyncThunk('todoLists/updateTodolist', async (param: { todolistId: string, title: string }, {
	dispatch,
	rejectWithValue
}) => {
	try {
		const res = await todolistsApi.updateTodolist(param.todolistId, param.title)
		if (res.data.resultCode === 0) {
			return {id: param.todolistId, title: param.title}
		} else {
			handleServerAppError(res.data, dispatch)
			return rejectWithValue(null)
		}
	} catch (error: any) {
		handleServerNetworkError(error, dispatch)
		return rejectWithValue(null)
	}
})