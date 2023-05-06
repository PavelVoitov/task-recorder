import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {loginTC, logoutTC} from "features/Auth/auth-actions";


export const slice = createSlice({
	name: 'auth',
	initialState: {isLoggedIn: false},
	reducers: {
		setIsLoggedInAC(state, action: PayloadAction<{ value: boolean }>) {
			state.isLoggedIn = action.payload.value
		}
	},
	extraReducers: builder => {
		builder.addCase(loginTC.fulfilled, (state) => {
			state.isLoggedIn = true
		})
		builder.addCase(logoutTC.fulfilled, (state) => {
			state.isLoggedIn = false
		})
	}
})

export const authReducer = slice.reducer
export const {setIsLoggedInAC} = slice.actions




