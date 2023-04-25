import React from 'react';
import {Provider} from "react-redux";
import {AppRootStateType, RootReducerType} from "app/store";
import {combineReducers} from "redux";
import {tasksReducer} from "features/TodolistsList/Todolists/tasks-reducer";
import {todolistsReducer} from "features/TodolistsList/Todolists/todolists-reducer";
import {v1} from "uuid";
import {TaskStatuses, TaskPriorities} from "api/todolists-api";
import {appReducer} from "app/app-reducer";
import thunk from "redux-thunk";
import {authReducer} from "features/Login/auth-reducer";
import {HashRouter} from "react-router-dom";
import {configureStore} from "@reduxjs/toolkit";

const rootReducer: RootReducerType = combineReducers({
	tasks: tasksReducer,
	todolists: todolistsReducer,
	app: appReducer,
	auth: authReducer

})

const initialGlobalState: AppRootStateType = {
	todolists: [
		{
			id: "todolistId1", title: "What to learn", addedDate: '',
			order: 0, filter: "all", entityStatus: 'idle'
		},
		{
			id: "todolistId2", title: "What to buy", addedDate: '',
			order: 0, filter: "all", entityStatus: 'loading'
		}
	],
	tasks: {
		["todolistId1"]: [
			{
				id: v1(), title: "HTML&CSS", status: TaskStatuses.Completed, todoListId: "todolistId1",
				description: '', startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low
			},
			{
				id: v1(), title: "JS", status: TaskStatuses.Completed, todoListId: "todolistId1",
				description: '', startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low,
			}
		],
		["todolistId2"]: [
			{
				id: v1(), title: "Milk", status: TaskStatuses.New, todoListId: "todolistId2",
				description: '', startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low,
			},
			{
				id: v1(), title: "React Book", status: TaskStatuses.Completed, todoListId: "todolistId2",
				description: '', startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low,
			}
		]
	},
	app: {
		error: null,
		status: 'succeeded',
		isInitialized: true
	},
	auth: {
		isLoggedIn: true
	}
};

export const storyBookStore = configureStore({
	reducer: rootReducer,
	preloadedState: initialGlobalState,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware()
			.prepend(thunk)
})


export const ReduxStoreProviderDecorator = (storyFn: () => React.ReactNode) => {
	return (
		<HashRouter>
			<Provider store={storyBookStore}>
				{storyFn()}
			</Provider>
		</HashRouter>
	)
}