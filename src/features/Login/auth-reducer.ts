import {Dispatch} from "redux";
import {authApi, FieldErrorType, LoginParamsType} from "api/todolists-api";
import {setAppStatusAC} from "app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "utils/error-utils";
import {clearTodolistsAC} from "../TodolistsList/Todolists/todolists-reducer";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

//thunks
export const loginTC = createAsyncThunk<{ isLoggedIn: true }, LoginParamsType, {
	rejectValue: { errors: string[], fieldsErrors?: FieldErrorType[] }
}>('auth/login', async (param, thunkAPI) => {
	thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
	try {
		const res = await authApi.login(param)
		if (res.data.resultCode === 0) {
			thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
			return {isLoggedIn: true}
		} else {
			handleServerAppError(res.data, thunkAPI.dispatch)
			return thunkAPI.rejectWithValue({errors: res.data.messages, fieldsErrors: res.data.fieldsErrors})
		}
	} catch (error: any) {
		handleServerNetworkError(error.message, thunkAPI.dispatch)
		return thunkAPI.rejectWithValue({errors: [error.message], fieldsErrors: undefined})
	}
})

const slice = createSlice({
	name: 'auth',
	initialState: {isLoggedIn: false},
	reducers: {
		setIsLoggedInAC(state, action: PayloadAction<{ value: boolean }>) {
			state.isLoggedIn = action.payload.value
		}
	},
	extraReducers: builder => {
		builder.addCase(loginTC.fulfilled, (state, action) => {
			state.isLoggedIn = action.payload.isLoggedIn
		})
	}
})

export const authReducer = slice.reducer
export const {setIsLoggedInAC} = slice.actions

// thunks
export const logoutTC = () => (dispatch: Dispatch) => {
	dispatch(setAppStatusAC({status: 'loading'}))
	authApi.logout()
		.then((res) => {
			if (res.data.resultCode === 0) {
				dispatch(setIsLoggedInAC({value: false}))
				dispatch(setAppStatusAC({status: 'succeeded'}))
				dispatch(clearTodolistsAC())
			} else {
				handleServerAppError(res.data, dispatch)
			}
		})
		.catch((error) => {
			handleServerNetworkError(error, dispatch)
		})
}



