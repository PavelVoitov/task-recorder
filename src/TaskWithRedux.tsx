
import {EditableSpan} from "./EditableSpan";
import React, {ChangeEvent} from "react";
import {TaskType} from "./Todolist";
import {Delete} from "@mui/icons-material";
import {Checkbox, IconButton} from "@mui/material";
import {useDispatch} from "react-redux";
import {changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "./state/tasks-reducer";
import './App.css'

export type TaskPropsType = {
    task: TaskType
    todolistId: string
}

export const TaskWithRedux = React.memo(({task, todolistId} : TaskPropsType) => {
    const dispatch = useDispatch()
    const onClickHandler = () => dispatch(removeTaskAC(task.id, todolistId))
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        let newIsDoneValue = e.currentTarget.checked;
        dispatch(changeTaskStatusAC(task.id, newIsDoneValue, todolistId));
    }
    const onTitleChangeHandler = (newValue: string) => {
        dispatch(changeTaskTitleAC(task.id, newValue, todolistId));
    }

    return (
            <div key={task.id} className={task.isDone ? 'isDone' : ""}>
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