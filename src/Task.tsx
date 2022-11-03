
import {EditableSpan} from "./EditableSpan";

import React, {ChangeEvent} from "react";
import {TaskType} from "./Todolist";
import {Delete} from "@mui/icons-material";
import {Checkbox, IconButton} from "@mui/material";

export type TaskPropsType = {
    task: TaskType
    changeTaskStatus: (id: string, isDone: boolean) => void
    changeTaskTitle: (taskId: string, newTitle: string) => void
    removeTask: (taskId: string) => void
}

export const Task = React.memo(({task, changeTaskTitle, changeTaskStatus, removeTask} : TaskPropsType) => {
    console.log('Task')
    const onClickHandler = () => removeTask(task.id)
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        let newIsDoneValue = e.currentTarget.checked;
        changeTaskStatus(task.id, newIsDoneValue);
    }
    const onTitleChangeHandler = (newValue: string) => {
        changeTaskTitle(task.id, newValue);
    }

    return (
            <div key={task.id} className={task.isDone ? "is-done" : ""}>
                <Checkbox
                    checked={task.isDone}
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