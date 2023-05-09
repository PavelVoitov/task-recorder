import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {authApi, FieldErrorType, LoginParamsType} from "api/todolists-api";
import {appActions} from "features/CommonActions/App";
import {clearTodolists} from "features/TodolistsList/Todolists/todolists-reducer";
import {handleAsyncServerAppError, handleAsyncServerNetworkError} from "utils/error-utils";

const {setAppStatus} = appActions

//thunks
export const login = createAsyncThunk<undefined, LoginParamsType, {
	rejectValue: {
		errors: string[],
		fieldsErrors?: FieldErrorType[]
	}
}>('auth/login', async (param, thunkAPI) => {
	thunkAPI.dispatch(setAppStatus({status: 'loading'}))
	try {
		const res = await authApi.login(param)
		if (res.data.resultCode === 0) {
			thunkAPI.dispatch(setAppStatus({status: 'succeeded'}))
			return
		} else {
			return handleAsyncServerAppError(res.data, thunkAPI)
		}
	} catch (error: any) {
		return handleAsyncServerNetworkError(error.message, thunkAPI)
	}
})
export const logout = createAsyncThunk('auth/logout', async (param, thunkAPI) => {
	thunkAPI.dispatch(setAppStatus({status: 'loading'}))
	try {
		const res = await authApi.logout()
		if (res.data.resultCode === 0) {
			thunkAPI.dispatch(setAppStatus({status: 'succeeded'}))
			thunkAPI.dispatch(clearTodolists())
			return
		} else {
			return handleAsyncServerAppError(res.data, thunkAPI)
		}
	} catch (error: any) {
		return handleAsyncServerNetworkError(error, thunkAPI)
	}
})

export const asyncActions = {
	login,
	logout
}

export const slice = createSlice({
	name: 'auth',
	initialState: {isLoggedIn: false},
	reducers: {
		setIsLoggedIn(state, action: PayloadAction<{ value: boolean }>) {
			state.isLoggedIn = action.payload.value
		}
	},
	extraReducers: builder => {
		builder
			.addCase(login.fulfilled, (state) => {
				state.isLoggedIn = true
			})
			.addCase(logout.fulfilled, (state) => {
				state.isLoggedIn = false
			})
	}
})





