import React, {useCallback} from 'react';
import {AddItemForm, AddItemFormSubmitHelperType} from 'components/AddItemForm/AddItemForm';
import {EditableSpan} from 'components/EditableSpan/EditableSpan';
import {Delete} from "@mui/icons-material";
import {Button, IconButton, Paper} from "@mui/material";
import {Task} from "./Task/Task";
import {TaskStatuses, TaskType} from "api/todolists-api";
import {FilterValuesType, TodolistDomainType} from "./todolists-reducer";
import {tasksActions, todolistsActions} from "features/TodolistsList/index";
import {AppDispatch, useActions} from "utils/redux-utils";


type PropsType = {
	todolist: TodolistDomainType
	tasks: Array<TaskType>
	demo?: boolean
}

export const Todolist = React.memo(({demo = false, ...props}: PropsType) => {
	const dispatch = AppDispatch()
	const {changeTodolistFilterAction, deleteTodolist, changeTodolistTitleAction} = useActions(todolistsActions)

	const addTaskCallback = useCallback(async (title: string, helper: AddItemFormSubmitHelperType) => {
		const resultAction = await dispatch(tasksActions.addTask({todolistId: props.todolist.id, title}))
		if (tasksActions.addTask.rejected.match(resultAction)) {
			if (resultAction.payload?.errors?.length) {
				const errorMessage = resultAction.payload.errors[0]
				helper.setError(errorMessage)
			} else {
				helper.setError("Some error occurred")
			}
		} else {
			helper.setTitle('')
		}
	}, [])

	const removeTodolist = useCallback(() => {
		deleteTodolist(props.todolist.id);
	}, [props.todolist.id])

	const changeTitle = useCallback((title: string) => {
		changeTodolistTitleAction({id: props.todolist.id, title});
	}, [props.todolist.id])

	const onFilterButtonClickHandler = useCallback((filter: FilterValuesType) =>
			changeTodolistFilterAction({id: props.todolist.id, filter}),
		[props.todolist.id])

	let tasksForTodolist = props.tasks;

	if (props.todolist.filter === "active") {
		tasksForTodolist = tasksForTodolist.filter(t => t.status === TaskStatuses.New);
	}
	if (props.todolist.filter === "completed") {
		tasksForTodolist = tasksForTodolist.filter(t => t.status === TaskStatuses.Completed);
	}

	const renderFilterButton = (
		color: "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning",
		title: string,
		filter: FilterValuesType) => {
		return <Button variant={props.todolist.filter === filter ? 'outlined' : 'text'}
									 onClick={() => onFilterButtonClickHandler(filter)}
									 color={color}>
			{title}
		</Button>
	}

	return <Paper style={{position: "relative", padding: "10px"}} elevation={8}>
		<IconButton onClick={removeTodolist} disabled={props.todolist.entityStatus === 'loading'}
								style={{position: "absolute", right: 5, top: 5}}
		>
			<Delete/>
		</IconButton>
		<h3>
			<EditableSpan title={props.todolist.title} changeTitle={changeTitle}/>
		</h3>
		<AddItemForm addItem={addTaskCallback} disabled={props.todolist.entityStatus === 'loading'}/>
		<div>
			{tasksForTodolist.map(t => {
				return <Task key={t.id} task={t} todolistId={props.todolist.id} todolistStatus={props.todolist.entityStatus}/>
			})}
			{tasksForTodolist.length === 0 && <span style={{padding: 5, color: "grey"}}>No tasks</span>}
		</div>
		<div style={{paddingTop: "10px"}}>
			{renderFilterButton('inherit', 'ALL', "all")}
			{renderFilterButton('primary', 'Active', "active")}
			{renderFilterButton('error', 'Completed', "completed")}
		</div>
	</Paper>
})

