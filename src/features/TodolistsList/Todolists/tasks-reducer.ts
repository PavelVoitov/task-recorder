import {TasksStateType} from "app/App";
import {
	addTodolistAC,
	changeTodolistEntityStatusAC,
	clearTodolistsAC,
	removeTodolistAC,
	setTodolistsAC,
} from "./todolists-reducer";
import {TaskType, todolistsApi, UpdateTaskModelType} from "api/todolists-api";
import {AppRootStateType} from "app/store";
import {setAppStatusAC} from "app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";


const initialState: TasksStateType = {}


//thunks
export const setTasksTC = createAsyncThunk('task/setTasksTC', async (todolistId: string, thunkAPI) => {
	thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
	const res = await todolistsApi.getTasks(todolistId)
	const tasks = res.data.items
	thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
	return {tasks, todolistId}
})
export const removeTaskTC = createAsyncThunk('task/removeTasksTC',
	async (param: { todolistId: string, taskId: string }, thunkAPI) => {
		thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
		thunkAPI.dispatch(changeTodolistEntityStatusAC({todoListId: param.todolistId, status: 'loading'}))
		try {
			await todolistsApi.deleteTask(param.todolistId, param.taskId)
			thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
			thunkAPI.dispatch(changeTodolistEntityStatusAC({todoListId: param.todolistId, status: 'succeeded'}))
			return {todolistId: param.todolistId, taskId: param.taskId}
		} catch (error: any) {
			handleServerNetworkError(error, thunkAPI.dispatch)
		}
	})
export const addTasksTC = createAsyncThunk('task/addTasksTC',
	async (param: { todolistId: string, title: string }, thunkAPI) => {
		thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
		try {
			const res = await todolistsApi.createTask(param.todolistId, param.title)
			if (res.data.resultCode === 0) {
				const task = res.data.data.item
				thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
				return {task}
			} else {
				handleServerAppError(res.data, thunkAPI.dispatch)
			}
		} catch (error: any) {
			thunkAPI.dispatch(setAppStatusAC({status: 'failed'}))
			handleServerNetworkError(error, thunkAPI.dispatch)
		}
	})
export const updateTaskTC = createAsyncThunk('task/updateTaskTC',
	async (param: { todolistId: string, taskId: string, domainModel: UpdateDomainTaskModelType }, thunkAPI) => {
		const {state} = thunkAPI.getState() as { state: AppRootStateType };
		const tasks = state.tasks
		const task = tasks[param.todolistId].find((t: TaskType) => t.id === param.taskId)
		if (task) {
			const apiModel: UpdateTaskModelType = {
				title: task.title,
				deadline: task.deadline,
				startDate: task.startDate,
				description: task.description,
				status: task.status,
				priority: task.priority,
				...param.domainModel
			}
			thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
			try {
				const res = await todolistsApi.updateTask(param.todolistId, param.taskId, apiModel)
				if (res.data.resultCode === 0) {
					thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
					return {
						taskId: param.taskId,
						model: param.domainModel,
						todolistId: param.todolistId
					}
				} else {
					handleServerAppError(res.data, thunkAPI.dispatch)
					thunkAPI.dispatch(setAppStatusAC({status: 'failed'}))
				}
			} catch (error: any) {
				handleServerNetworkError(error, thunkAPI.dispatch)
			}
		}
	})
// export const updateTaskTC_ = (todolistId: string, taskId: string, domainModel: UpdateDomainTaskModelType) => (dispatch: Dispatch, getState: () => AppRootStateType) => {
// 	const tasks = getState().tasks
// 	const task = tasks[todolistId].find(t => t.id === taskId)
// 	if (task) {
// 		const apiModel: UpdateTaskModelType = {
// 			title: task.title,
// 			deadline: task.deadline,
// 			startDate: task.startDate,
// 			description: task.description,
// 			status: task.status,
// 			priority: task.priority,
// 			...domainModel
// 		}
// 		dispatch(setAppStatusAC({status: 'loading'}))
// 		todolistsApi.updateTask(todolistId, taskId, apiModel)
// 			.then((res) => {
// 				if (res.data.resultCode === 0) {
// 					dispatch(updateTaskAC({taskId: taskId, model: domainModel, todolistId: todolistId}))
// 					dispatch(setAppStatusAC({status: 'succeeded'}))
// 				} else {
// 					handleServerAppError(res.data, dispatch)
// 					dispatch(setAppStatusAC({status: 'failed'}))
// 				}
// 			})
// 			.catch((error) => {
// 				handleServerNetworkError(error, dispatch)
// 			})
// 	}
// }

const slice = createSlice({
	name: 'task',
	initialState: initialState,
	reducers: {
		updateTaskAC(state, action: PayloadAction<{ taskId: string, model: UpdateDomainTaskModelType, todolistId: string }>) {
			const tasks = state[action.payload.todolistId]
			const index = tasks.findIndex(t => t.id === action.payload.taskId)
			tasks[index] = {...tasks[index], ...action.payload.model}
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
		builder.addCase(setTasksTC.fulfilled, (state, action) => {
			state[action.payload.todolistId] = action.payload.tasks
		})
		builder.addCase(removeTaskTC.fulfilled, (state, action) => {
			if (action.payload) {
				const tasks = state[action.payload.todolistId]
				const index = tasks.findIndex(t => t.id === action.payload?.taskId)
				tasks.splice(index, 1)
			}
		})
		builder.addCase(addTasksTC.fulfilled, (state, action) => {
			if (action.payload) {
				state[action.payload.task.todoListId].unshift(action.payload.task)
			}
		})
		builder.addCase(updateTaskTC.fulfilled, (state, action) => {
			if (action.payload) {
				const tasks = state[action.payload.todolistId]
				const index = tasks.findIndex(t => t.id === action.payload?.taskId)
				tasks[index] = {...tasks[index], ...action.payload.model}
			}
		})
		builder.addCase(clearTodolistsAC, () => {
			return {}
		})
	}
})

export const tasksReducer = slice.reducer
export const {updateTaskAC} = slice.actions

//types
export type UpdateDomainTaskModelType = {
	title?: string
	description?: string
	status?: number
	priority?: number
	startDate?: string
	deadline?: string
}

