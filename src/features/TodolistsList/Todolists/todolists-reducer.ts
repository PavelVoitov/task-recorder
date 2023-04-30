import {todolistsApi, TodolistType} from "api/todolists-api";
import {RequestStatusType, setAppStatusAC} from "app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "utils/error-utils";
import {setTasksTC} from "./tasks-reducer";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

//thunks
export const getTodolistsTC = createAsyncThunk('todoLists/getTodolists', async (param, {dispatch, rejectWithValue}) => {
	dispatch(setAppStatusAC({status: 'loading'}))
	try {
		const res = await todolistsApi.getTodolist()
		dispatch(setAppStatusAC({status: 'succeeded'}))
		const todolists = res.data
		todolists.forEach((tl: TodolistDomainType) => {
			dispatch(setTasksTC(tl.id))
		})
		return {todolists: res.data}
	} catch (error: any) {
		handleServerNetworkError(error, dispatch)
		return rejectWithValue(null)
	}
})
export const deleteTodolistTC = createAsyncThunk('todoLists/deleteTodolist', async (todolistId: string, {
	dispatch,
	rejectWithValue
}) => {
	dispatch(setAppStatusAC({status: 'loading'}))
	dispatch(changeTodolistEntityStatusAC({todoListId: todolistId, status: 'loading'}))
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
export const createTodolistTC = createAsyncThunk('todoLists/createTodolist', async (title: string, {
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
export const updateTodolistTC = createAsyncThunk('todoLists/updateTodolist', async (param: { todolistId: string, title: string }, {
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

const slice = createSlice({
	name: 'todoLists',
	initialState: [] as TodolistDomainType[],
	reducers: {
		changeTodolistFilterAC(state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) {
			const index = state.findIndex(el => el.id === action.payload.id)
			state[index].filter = action.payload.filter
		},
		changeTodolistTitleAC(state, action: PayloadAction<{ id: string, title: string }>) {
			const index = state.findIndex(el => el.id === action.payload.id)
			state[index].title = action.payload.title
		},
		changeTodolistEntityStatusAC(state, action: PayloadAction<{ todoListId: string, status: RequestStatusType }>) {
			const index = state.findIndex(el => el.id === action.payload.todoListId)
			state[index].entityStatus = action.payload.status
		},
		clearTodolistsAC() {
			return []
		},
	},
	extraReducers: builder => {
		builder.addCase(getTodolistsTC.fulfilled, (state, action) => {
			return action.payload.todolists.map((tl: TodolistType) => ({...tl, filter: 'all', entityStatus: 'idle'}))
		})
		builder.addCase(deleteTodolistTC.fulfilled, (state, action) => {
			const index = state.findIndex(el => el.id === action.payload.id)
			if (index > -1) {
				state.splice(index, 1)
			}
		})
		builder.addCase(createTodolistTC.fulfilled, (state, action) => {
			state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'})
		})
		builder.addCase(updateTodolistTC.fulfilled, (state, action) => {
			const index = state.findIndex(el => el.id === action.payload.id)
			state[index].title = action.payload.title
		})
	}
})

export const todolistsReducer = slice.reducer
export const {
	changeTodolistTitleAC,
	changeTodolistFilterAC,
	clearTodolistsAC,
	changeTodolistEntityStatusAC,
} = slice.actions

//types
export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
	filter: FilterValuesType
	entityStatus: RequestStatusType
}
