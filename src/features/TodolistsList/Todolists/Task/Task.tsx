import {EditableSpan} from "../../../../components/EditableSpan/EditableSpan";
import React, {ChangeEvent, useCallback} from "react";
import {Delete} from "@mui/icons-material";
import {Checkbox, IconButton} from "@mui/material";
import {
    removeTasksTC,
    updateTaskTC,
    updateTaskTitleTC
} from "../tasks-reducer";
import '../../../../app/App.css'
import {TaskStatuses, TaskType} from "../../../../api/todolist-api";
import {AppDispatch} from "../../../../app/store";

export type TaskPropsType = {
    task: TaskType
    todolistId: string
}

export const Task = React.memo(({task, todolistId} : TaskPropsType) => {
    const dispatch = AppDispatch()

    const onClickHandler = useCallback(() => dispatch(removeTasksTC(todolistId, task.id)), [])

    const onChangeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        let newIsDoneValue = e.currentTarget.checked;
        dispatch(updateTaskTC(todolistId, task.id, newIsDoneValue ? TaskStatuses.Completed : TaskStatuses.New))}, [])

    const onTitleChangeHandler = useCallback((newValue: string) => {
        dispatch(updateTaskTitleTC(task.id, newValue, todolistId));
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