import {createAsyncThunk} from "@reduxjs/toolkit";
import {authApi} from "api/todolists-api";
import {setIsLoggedInAC} from "features/Auth/auth-reducer";
import {handleServerAppError, handleServerNetworkError} from "utils/error-utils";


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