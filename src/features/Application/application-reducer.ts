import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {authApi} from "api/todolists-api";
import {appActions} from "features/CommonActions/App";
import {authActions} from "features/Auth";
import {handleAsyncServerAppError, handleAsyncServerNetworkError} from "utils/error-utils";

//thunks
export const initializeApp = createAsyncThunk('app/initializeApp', async (param, thunkAPI) => {
	try {
		const res = await authApi.me()
		if (res.data.resultCode === 0) {
			thunkAPI.dispatch(authActions.setIsLoggedIn({value: true}))
			return
		} else {
			return handleAsyncServerAppError(res.data, thunkAPI)
		}
	} catch (error: any) {
		return handleAsyncServerNetworkError(error, thunkAPI)
	}
})

export const asyncActions = {
	initializeApp
}

export const slice = createSlice({
	name: 'app',
	initialState: {
		status: 'idle' as RequestStatusType,
		error: null as ErrorType,
		isInitialized: false
	} as InitialStateType,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(appActions.setAppStatus, (state, action) => {
				state.status = action.payload.status
			})
			.addCase(appActions.setAppError, (state, action) => {
				state.error = action.payload.error
			})
			.addMatcher(
				(action) =>
					action.type === initializeApp.fulfilled.type ||
					action.type === initializeApp.rejected.type,
				(state) => {
					state.isInitialized = true;
				}
			)
	}
})

//types
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type ErrorType = string | null
export type InitialStateType = {
	error: ErrorType,
	status: RequestStatusType,
	isInitialized: boolean
}



