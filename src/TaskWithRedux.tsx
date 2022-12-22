import {EditableSpan} from "./EditableSpan";
import React, {ChangeEvent, useCallback} from "react";
import {Delete} from "@mui/icons-material";
import {Checkbox, IconButton} from "@mui/material";
import {changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, removeTasksTC, updateTaskTC} from "./state/tasks-reducer";
import './App.css'
import {TaskStatuses, TaskType} from "./api/todolist-api";
import {AppDispatch} from "./state/store";

export type TaskPropsType = {
    task: TaskType
    todolistId: string
}

export const TaskWithRedux = React.memo(({task, todolistId} : TaskPropsType) => {
    const dispatch = AppDispatch()

    const onClickHandler = useCallback(() => dispatch(removeTasksTC(todolistId, task.id)), [])

    const onChangeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        let newIsDoneValue = e.currentTarget.checked;
        dispatch(updateTaskTC(todolistId, task.id, newIsDoneValue ? TaskStatuses.Completed : TaskStatuses.New))}, [])

    const onTitleChangeHandler = useCallback((newValue: string) => {
        dispatch(changeTaskTitleAC(task.id, newValue, todolistId));
    }, [])

    return (
            <div key={task.id} className={task.status === TaskStatuses.Completed ? 'isDone' : ""}>
                <Checkbox
                    checked={task.status === TaskStatuses.Completed}
                    color="primary"
                    onChange={onChangeHandler}
                />

                <EditableSpan title={task.title} changeTitle={onTitleChangeHandler} />

                <IconButton onClick={onClickHandler}>
                    <Delete />
                </IconButton>
            </div>
    )
})