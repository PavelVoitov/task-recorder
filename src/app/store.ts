import {tasksReducer, todolistsReducer} from 'features/TodolistsList'
import {combineReducers} from "redux";
import thunk from 'redux-thunk'
import {authReducer} from "features/Auth";
import {configureStore} from "@reduxjs/toolkit";
import {appReducer} from "features/Application";

export const rootReducer = combineReducers({
	tasks: tasksReducer,
	todolists: todolistsReducer,
	app: appReducer,
	auth: authReducer
})

export const store = configureStore({
	reducer: rootReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware()
			.prepend(thunk)
})

// @ts-ignore
window.store = store;


