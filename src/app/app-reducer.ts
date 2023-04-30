import {authApi} from "api/todolists-api";
import {setIsLoggedInAC} from "features/Login/auth-reducer";
import {handleServerAppError, handleServerNetworkError} from "utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";


//thunks
export const initializeAppTC = createAsyncThunk('app/initializeApp', async (param, {dispatch, rejectWithValue}) => {
	try {
		const res = await authApi.me()
		if (res.data.resultCode === 0) {
			dispatch(setIsLoggedInAC({value: true}))
		} else {
			handleServerAppError(res.data, dispatch)
			return rejectWithValue({})
		}
	} catch (error: any) {
		handleServerNetworkError(error, dispatch)
		return rejectWithValue({})
	}

})

const slice = createSlice({
	name: 'app',
	initialState: {
		status: 'idle' as RequestStatusType,
		error: null as ErrorType,
		isInitialized: false
	},
	reducers: {
		setAppErrorAC(state, action: PayloadAction<{ error: ErrorType }>) {
			state.error = action.payload.error
		},
		setAppStatusAC(state, action: PayloadAction<{ status: RequestStatusType }>) {
			state.status = action.payload.status
		}
	},
	extraReducers: builder => {
		builder.addCase(initializeAppTC.fulfilled, (state) => {
			state.isInitialized = true
		})
	}
})

export const appReducer = slice.reducer
export const {setAppErrorAC, setAppStatusAC} = slice.actions

//types
export type SetAppErrorType = ReturnType<typeof setAppErrorAC>
export type SetAppStatusType = ReturnType<typeof setAppStatusAC>
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type ErrorType = string | null



