import {todolistsApi, TodolistType} from "api/todolists-api";
import {RequestStatusType} from "features/Application";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {setTasks} from "features/TodolistsList/Todolists/Task/tasks-reducer";
import {handleAsyncServerAppError, handleAsyncServerNetworkError} from "utils/error-utils";
import {ThunkError} from "utils/types";
import {appActions} from "features/CommonActions/App";

//thunks
export const setTodolists = createAsyncThunk<{ todolists: TodolistType[] }, undefined, ThunkError>('todoLists/getTodolists', async (param, thunkAPI) => {
	thunkAPI.dispatch(appActions.setAppStatus({status: 'loading'}))
	try {
		const res = await todolistsApi.getTodolist()
		thunkAPI.dispatch(appActions.setAppStatus({status: 'succeeded'}))
		const todolists = res.data
		todolists.forEach((tl: TodolistDomainType) => {
			thunkAPI.dispatch(setTasks(tl.id))
		})
		return {todolists: res.data}
	} catch (error: any) {
		return handleAsyncServerNetworkError(error, thunkAPI)
	}
})
export const deleteTodolist = createAsyncThunk<{ id: string }, string, ThunkError>('todoLists/deleteTodolist', async (todolistId: string, thunkAPI) => {
	thunkAPI.dispatch(appActions.setAppStatus({status: 'loading'}))
	thunkAPI.dispatch(changeTodolistEntityStatusAction({todoListId: todolistId, status: 'loading'}))
	try {
		const res = await todolistsApi.deleteTodolist(todolistId)
		if (res.data.resultCode === 0) {
			thunkAPI.dispatch(appActions.setAppStatus({status: 'succeeded'}))
			return {id: todolistId}
		} else {
			return handleAsyncServerAppError(res.data, thunkAPI)
		}
	} catch (error: any) {
		return handleAsyncServerNetworkError(error, thunkAPI)
	}
})
export const addTodolist = createAsyncThunk<{ todolist: TodolistType }, string,
	ThunkError>('todoLists/createTodolist', async (title: string, thunkAPI) => {
	thunkAPI.dispatch(appActions.setAppStatus({status: 'loading'}))
	try {
		const res = await todolistsApi.createTodolist(title)
		if (res.data.resultCode === 0) {
			thunkAPI.dispatch(appActions.setAppStatus({status: 'succeeded'}))
			return {todolist: res.data.data.item}
		} else {
			return handleAsyncServerAppError(res.data, thunkAPI, false)
		}
	} catch (error: any) {
		return handleAsyncServerNetworkError(error, thunkAPI)
	}
})
export const changeTodolistTitle = createAsyncThunk('todoLists/updateTodolist', async (param: { todolistId: string, title: string }, thunkAPI) => {
	try {
		const res = await todolistsApi.updateTodolist(param.todolistId, param.title)
		if (res.data.resultCode === 0) {
			return {id: param.todolistId, title: param.title}
		} else {
			return handleAsyncServerAppError(res.data, thunkAPI)
		}
	} catch (error: any) {
		return handleAsyncServerNetworkError(error, thunkAPI)
	}
})

export const asyncTodolistsActions = {
	getTodolists: setTodolists,
	deleteTodolist,
	addTodolist,
	changeTodolistTitle
}

export const slice = createSlice({
	name: 'todoLists',
	initialState: [] as TodolistDomainType[],
	reducers: {
		changeTodolistFilterAction(state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) {
			const index = state.findIndex(el => el.id === action.payload.id)
			state[index].filter = action.payload.filter
		},
		changeTodolistTitleAction(state, action: PayloadAction<{ id: string, title: string }>) {
			const index = state.findIndex(el => el.id === action.payload.id)
			state[index].title = action.payload.title
		},
		changeTodolistEntityStatusAction(state, action: PayloadAction<{ todoListId: string, status: RequestStatusType }>) {
			const index = state.findIndex(el => el.id === action.payload.todoListId)
			state[index].entityStatus = action.payload.status
		},
		clearTodolists() {
			return []
		},
	},
	extraReducers: builder => {
		builder
			.addCase(setTodolists.fulfilled, (state, action) => {
				return action.payload.todolists.map((tl: TodolistType) => ({...tl, filter: 'all', entityStatus: 'idle'}))
			})
			.addCase(deleteTodolist.fulfilled, (state, action) => {
				const index = state.findIndex(el => el.id === action.payload.id)
				if (index > -1) {
					state.splice(index, 1)
				}
			})
			.addCase(addTodolist.fulfilled, (state, action) => {
				state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'})
			})
			.addCase(changeTodolistTitle.fulfilled, (state, action) => {
				const index = state.findIndex(el => el.id === action.payload.id)
				state[index].title = action.payload.title
			})
	}
})

export const {
	changeTodolistEntityStatusAction,
	changeTodolistFilterAction,
	changeTodolistTitleAction,
	clearTodolists
} = slice.actions

//types
export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
	filter: FilterValuesType
	entityStatus: RequestStatusType
}
