import {EditableSpan} from "../../../../components/EditableSpan/EditableSpan";
import React, {ChangeEvent, useCallback} from "react";
import {Delete} from "@mui/icons-material";
import {Checkbox, IconButton} from "@mui/material";
import {
    removeTasksTC, updateTaskTC,
} from "../tasks-reducer";
import '../../../../app/App.css'
import {TaskStatuses, TaskType} from "../../../../api/todolist-api";
import {AppDispatch} from "../../../../app/store";
import {RequestStatusType} from "../../../../app/app-reducer";

export type TaskPropsType = {
    task: TaskType
    todolistId: string
    todolistStatus: RequestStatusType
}

export const Task = React.memo(({task, todolistId, todolistStatus} : TaskPropsType) => {
    const dispatch = AppDispatch()

    const onClickHandler = useCallback(() => dispatch(removeTasksTC(todolistId, task.id)), [])

    const onChangeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        let newIsDoneValue = e.currentTarget.checked;
        dispatch(updateTaskTC(todolistId, task.id, {status: newIsDoneValue ? TaskStatuses.Completed : TaskStatuses.New}))}, [])

    const onTitleChangeHandler = useCallback((newValue: string) => {
        dispatch(updateTaskTC(todolistId, task.id, {title: newValue}));
    }, [])

    return (
            <div key={task.id} className={task.status === TaskStatuses.Completed ? 'isDone' : ""}>
                <Checkbox
                    checked={task.status === TaskStatuses.Completed}
                    color="primary"
                    onChange={onChangeHandler}
                    disabled={todolistStatus === 'loading'}
                />

                <EditableSpan title={task.title} changeTitle={onTitleChangeHandler}/>

                <IconButton onClick={onClickHandler} disabled={todolistStatus === 'loading'}>
                    <Delete />
                </IconButton>
            </div>
    )
})