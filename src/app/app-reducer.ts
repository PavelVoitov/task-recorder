import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {initializeAppTC} from "app/app-actions";

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



