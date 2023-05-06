import {TodolistType} from "api/todolists-api";
import {RequestStatusType} from "app/app-reducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {
	createTodolist,
	deleteTodolist,
	getTodolists,
	changeTodolistTitle
} from "features/TodolistsList/Todolists/todolists-actions";

export const slice = createSlice({
	name: 'todoLists',
	initialState: [] as TodolistDomainType[],
	reducers: {
		changeTodolistFilterAction(state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) {
			const index = state.findIndex(el => el.id === action.payload.id)
			state[index].filter = action.payload.filter
		},
		changeTodolistTitleAction(state, action: PayloadAction<{ id: string, title: string }>) {
			const index = state.findIndex(el => el.id === action.payload.id)
			state[index].title = action.payload.title
		},
		changeTodolistEntityStatusAction(state, action: PayloadAction<{ todoListId: string, status: RequestStatusType }>) {
			const index = state.findIndex(el => el.id === action.payload.todoListId)
			state[index].entityStatus = action.payload.status
		},
		clearTodolists() {
			return []
		},
	},
	extraReducers: builder => {
		builder.addCase(getTodolists.fulfilled, (state, action) => {
			return action.payload.todolists.map((tl: TodolistType) => ({...tl, filter: 'all', entityStatus: 'idle'}))
		})
		builder.addCase(deleteTodolist.fulfilled, (state, action) => {
			const index = state.findIndex(el => el.id === action.payload.id)
			if (index > -1) {
				state.splice(index, 1)
			}
		})
		builder.addCase(createTodolist.fulfilled, (state, action) => {
			state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'})
		})
		builder.addCase(changeTodolistTitle.fulfilled, (state, action) => {
			const index = state.findIndex(el => el.id === action.payload.id)
			state[index].title = action.payload.title
		})
	}
})

export const todolistsReducer = slice.reducer
export const {clearTodolists, changeTodolistTitleAction, changeTodolistEntityStatusAction, changeTodolistFilterAction} = slice.actions

//types
export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
	filter: FilterValuesType
	entityStatus: RequestStatusType
}
