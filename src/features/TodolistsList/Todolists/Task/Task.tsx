import {EditableSpan} from "components/EditableSpan/EditableSpan";
import React, {ChangeEvent, useCallback} from "react";
import {Delete} from "@mui/icons-material";
import {Checkbox, IconButton} from "@mui/material";
import '../../../../app/App.css'
import {TaskStatuses, TaskType} from "api/todolists-api";
import {useAction} from "app/store";
import {RequestStatusType} from "app/app-reducer";
import {tasksActions} from "features/TodolistsList/index";

export type TaskPropsType = {
	task: TaskType
	todolistId: string
	todolistStatus: RequestStatusType
}

export const Task = React.memo(({task, todolistId, todolistStatus}: TaskPropsType) => {
	const {removeTask, updateTask} = useAction(tasksActions)

	const onClickHandler = useCallback(() => removeTask({todolistId, taskId: task.id}), [])

	const onChangeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
		updateTask({
			todolistId,
			taskId: task.id,
			model: {status: e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New}
		})
	}, [])

	const onTitleChangeHandler = useCallback((newValue: string) => {
		updateTask({todolistId, taskId: task.id, model: {title: newValue}})
	}, [])

	return (
		<div
			key={task.id}
			className={task.status === TaskStatuses.Completed ? 'isDone' : ""}
			style={{
				position: "relative",
				display: "flex",
				flexDirection: "row",
				alignItems: "center"
			}}
		>
			<Checkbox
				checked={task.status === TaskStatuses.Completed}
				color="primary"
				onChange={onChangeHandler}
				disabled={todolistStatus === 'loading'}
			/>
			<EditableSpan title={task.title} changeTitle={onTitleChangeHandler}/>
			<IconButton
				onClick={onClickHandler}
				disabled={todolistStatus === 'loading'}
				style={{position: "absolute", right: 5, top: 2}}
			>
				<Delete/>
			</IconButton>
		</div>
	)
})