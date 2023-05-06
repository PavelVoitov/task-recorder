import React, {useCallback} from 'react';
import {AddItemForm} from 'components/AddItemForm/AddItemForm';
import {EditableSpan} from 'components/EditableSpan/EditableSpan';
import {Delete} from "@mui/icons-material";
import {Button, IconButton} from "@mui/material";
import {Task} from "./Task/Task";
import {TaskStatuses, TaskType} from "api/todolists-api";
import {FilterValuesType, TodolistDomainType} from "./todolists-reducer";
import {useAction} from "app/store";
import {tasksActions, todolistsActions} from "features/TodolistsList/index";


type PropsType = {
	todolist: TodolistDomainType
	tasks: Array<TaskType>
	demo?: boolean
}

export const Todolist = React.memo(({demo = false, ...props}: PropsType) => {
	const {addTask} = useAction(tasksActions)
	const {changeTodolistFilterAction, deleteTodolist, changeTodolistTitleAction} = useAction(todolistsActions)

	const addTaskCallback = useCallback((title: string) => {
		addTask({todolistId: props.todolist.id, title});
	}, [props.todolist.id])

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

	return <div>
		<h3><EditableSpan title={props.todolist.title} changeTitle={changeTitle}/>
			<IconButton onClick={removeTodolist} disabled={props.todolist.entityStatus === 'loading'}>
				<Delete/>
			</IconButton>
		</h3>
		<AddItemForm addItem={addTaskCallback} disabled={props.todolist.entityStatus === 'loading'}/>
		<div>
			{
				tasksForTodolist.map(t => {
					return <Task key={t.id}
											 task={t}
											 todolistId={props.todolist.id}
											 todolistStatus={props.todolist.entityStatus}
					/>
				})
			}
		</div>
		<div style={{paddingTop: "10px"}}>
			{renderFilterButton( 'inherit', 'ALL', "all")}
			{renderFilterButton( 'primary', 'Active', "active")}
			{renderFilterButton( 'error', 'Completed', "completed")}
		</div>
	</div>
})

