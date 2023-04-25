import {TasksStateType} from "app/App";
import {
	addTodolistAC,
	changeTodolistEntityStatusAC,
	clearTodolistsAC,
	removeTodolistAC,
	setTodolistsAC,
} from "./todolists-reducer";
import {TaskType, todolistsApi, UpdateTaskModelType} from "api/todolists-api";
import {Dispatch} from "redux";
import {AppRootStateType} from "app/store";
import {setAppStatusAC} from "app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";


const initialState: TasksStateType = {}

const slice = createSlice({
	name: 'task',
	initialState: initialState,
	reducers: {
		removeTaskAC(state, action: PayloadAction<{ todolistId: string, taskId: string }>) {
			const tasks = state[action.payload.todolistId]
			const index = tasks.findIndex(t => t.id === action.payload.taskId)
			tasks.splice(index, 1)
		},
		addTaskAC(state, action: PayloadAction<TaskType>) {
			state[action.payload.todoListId].unshift(action.payload)
		},
		updateTaskAC(state, action: PayloadAction<{ taskId: string, model: UpdateDomainTaskModelType, todolistId: string }>) {
			const tasks = state[action.payload.todolistId]
			const index = tasks.findIndex(t => t.id === action.payload.taskId)
			tasks[index] = {...tasks[index], ...action.payload.model}
		},
		setTasksAC(state, action: PayloadAction<{ tasks: Array<TaskType>, todolistId: string }>) {
			state[action.payload.todolistId] = action.payload.tasks
		},
	},
	extraReducers: (builder) => {
		builder.addCase(addTodolistAC, (state, action) => {
			state[action.payload.todolist.id] = []
		})
		builder.addCase(removeTodolistAC, (state, action) => {
			delete state[action.payload.id]
		})
		builder.addCase(setTodolistsAC, (state, action) => {
			action.payload.todolists.forEach(tl => {
				state[tl.id] = []
			})
		})
		builder.addCase(clearTodolistsAC, () => {
			return {}
		})
	}
})

export const tasksReducer = slice.reducer
export const {removeTaskAC, setTasksAC, updateTaskAC, addTaskAC} = slice.actions

// thunks
export const setTasksTC = (todolistId: string) => (dispatch: Dispatch) => {
	dispatch(setAppStatusAC({status: 'loading'}))
	todolistsApi.getTasks(todolistId)
		.then((res) => {
			const tasks = res.data.items
			dispatch(setTasksAC({tasks, todolistId}))
			dispatch(setAppStatusAC({status: 'succeeded'}))
		})

}
export const removeTasksTC = (todolistId: string, taskId: string) => (dispatch: Dispatch) => {
	dispatch(setAppStatusAC({status: 'loading'}))
	dispatch(changeTodolistEntityStatusAC({todoListId: todolistId, status: 'loading'}))
	todolistsApi.deleteTask(todolistId, taskId)
		.then(() => {
			dispatch(removeTaskAC({todolistId: todolistId, taskId: taskId}))
			dispatch(setAppStatusAC({status: 'succeeded'}))
			dispatch(changeTodolistEntityStatusAC({todoListId: todolistId, status: 'succeeded'}))
		})
		.catch((error) => {
			handleServerNetworkError(error, dispatch)
		})
}
export const addTasksTC = (todolistId: string, title: string) => (dispatch: Dispatch) => {
	dispatch(setAppStatusAC({status: 'loading'}))
	todolistsApi.createTask(todolistId, title)
		.then((res) => {
			if (res.data.resultCode === 0) {
				dispatch(addTaskAC(res.data.data.item))
				dispatch(setAppStatusAC({status: 'succeeded'}))
			} else {
				handleServerAppError(res.data, dispatch)
			}
		})
		.catch((error) => {
			dispatch(setAppStatusAC({status: 'failed'}))
			handleServerNetworkError(error, dispatch)
		})
}

export type UpdateDomainTaskModelType = {
	title?: string
	description?: string
	status?: number
	priority?: number
	startDate?: string
	deadline?: string
}

export const updateTaskTC = (todolistId: string, taskId: string, domainModel: UpdateDomainTaskModelType) => (dispatch: Dispatch, getState: () => AppRootStateType) => {
	const tasks = getState().tasks
	const task = tasks[todolistId].find(t => t.id === taskId)
	if (task) {
		const apiModel: UpdateTaskModelType = {
			title: task.title,
			deadline: task.deadline,
			startDate: task.startDate,
			description: task.description,
			status: task.status,
			priority: task.priority,
			...domainModel
		}
		dispatch(setAppStatusAC({status: 'loading'}))
		todolistsApi.updateTask(todolistId, taskId, apiModel)
			.then((res) => {
				if (res.data.resultCode === 0) {
					dispatch(updateTaskAC({taskId: taskId, model: domainModel, todolistId: todolistId}))
					dispatch(setAppStatusAC({status: 'succeeded'}))
				} else {
					handleServerAppError(res.data, dispatch)
					dispatch(setAppStatusAC({status: 'failed'}))
				}
			})
			.catch((error) => {
				handleServerNetworkError(error, dispatch)
			})
	}
}


