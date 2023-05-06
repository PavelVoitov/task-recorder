import {createAsyncThunk} from "@reduxjs/toolkit";
import {authApi, FieldErrorType, LoginParamsType} from "api/todolists-api";
import {setAppStatusAC} from "app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "utils/error-utils";
import {clearTodolists} from "features/TodolistsList/Todolists/todolists-reducer";


//thunks
export const loginTC = createAsyncThunk<undefined, LoginParamsType, {
	rejectValue: {
		errors: string[],
		fieldsErrors?: FieldErrorType[]
	}
}>('auth/login', async (param, thunkAPI) => {
	thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
	try {
		const res = await authApi.login(param)
		if (res.data.resultCode === 0) {
			thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
			return
		} else {
			handleServerAppError(res.data, thunkAPI.dispatch)
			return thunkAPI.rejectWithValue({errors: res.data.messages, fieldsErrors: res.data.fieldsErrors})
		}
	} catch (error: any) {
		handleServerNetworkError(error.message, thunkAPI.dispatch)
		return thunkAPI.rejectWithValue({errors: [error.message], fieldsErrors: undefined})
	}
})
export const logoutTC = createAsyncThunk('auth/logout', async (param, thunkAPI) => {
	thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
	try {
		const res = await authApi.logout()
		if (res.data.resultCode === 0) {
			thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
			thunkAPI.dispatch(clearTodolists())
			return
		} else {
			handleServerAppError(res.data, thunkAPI.dispatch)
			return thunkAPI.rejectWithValue({})
		}
	} catch (error: any) {
		handleServerNetworkError(error, thunkAPI.dispatch)
		return thunkAPI.rejectWithValue({})
	}
})