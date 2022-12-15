import React, {useCallback} from 'react';
import {FilterValuesType} from './AppWithRedux';
import {AddItemForm} from './AddItemForm';
import {EditableSpan} from './EditableSpan';
import {Task} from "./Task";
import {Delete} from "@mui/icons-material";
import {Button, IconButton} from "@mui/material";
import {TaskWithRedux} from "./TaskWithRedux";


export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type PropsType = {
    id: string
    title: string
    tasks: Array<TaskType>
    removeTask: (taskId: string, todolistId: string) => void
    changeFilter: (value: FilterValuesType, todolistId: string) => void
    addTask: (title: string, todolistId: string) => void
    changeTaskStatus: (id: string, isDone: boolean, todolistId: string) => void
    removeTodolist: (id: string) => void
    changeTodolistTitle: (id: string, newTitle: string) => void
    filter: FilterValuesType
    changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
}


export const Todolist = React.memo((props: PropsType) => {
    console.log('Todolist')
    const addTask = useCallback((title: string) => {
        props.addTask(title, props.id);
    }, [props.addTask, props.id])

    const removeTodolist = useCallback(() => {
        props.removeTodolist(props.id);
    }, [props.removeTodolist, props.id])
    const changeTodolistTitle = useCallback((title: string) => {
        props.changeTodolistTitle(props.id, title);
    }, [props.changeTodolistTitle, props.id])

    const onAllClickHandler = useCallback(() => props.changeFilter("all", props.id), [props.changeFilter, props.id]);
    const onActiveClickHandler = useCallback(() => props.changeFilter("active", props.id), [props.changeFilter, props.id]);
    const onCompletedClickHandler = useCallback(() => props.changeFilter("completed", props.id), [props.changeFilter, props.id]);

    let tasksForTodolist = props.tasks;

    if (props.filter === "active") {
        tasksForTodolist = tasksForTodolist.filter(t => !t.isDone);
    }
    if (props.filter === "completed") {
        tasksForTodolist = tasksForTodolist.filter(t => t.isDone);
    }

    const removeTask = useCallback((taskId: string) => props.removeTask(taskId, props.id), [props.removeTask, props.id])
    const onChangeHandler = useCallback((taskId: string, status: boolean) => {
        props.changeTaskStatus(taskId, status, props.id);
    }, [props.changeTaskStatus, props.id])
    const onTitleChangeHandler = useCallback((taskId: string, newValue: string) => {
        props.changeTaskTitle(taskId, newValue, props.id);
    }, [props.changeTaskTitle, props.id])

    return <div>
        <h3><EditableSpan title={props.title} changeTitle={changeTodolistTitle}/>
            <IconButton onClick={removeTodolist}>
                <Delete/>
            </IconButton>
        </h3>
        <AddItemForm addItem={addTask}/>
        <div>
            {
                tasksForTodolist.map(t => {
                    return <TaskWithRedux key={t.id}
                                          task={t}
                                          todolistId={props.id}/>
                })
            }
        </div>
        <div style={{paddingTop: "10px"}}>
            <ButtonWithMemo variant={props.filter === 'all' ? 'outlined' : 'text'}
                            onClick={onAllClickHandler}
                            color={'inherit'}
                            title={'ALL'}
            />
            <ButtonWithMemo
                variant={props.filter === 'active' ? 'outlined' : 'text'}
                onClick={onActiveClickHandler}
                color={'primary'}
                title={'Active'}
            />
            <ButtonWithMemo
                variant={props.filter === 'completed' ? 'outlined' : 'text'}
                onClick={onCompletedClickHandler}
                color={'secondary'}
                title={'Completed'}
            />
        </div>
    </div>
})

type ButtonWithMemoPropsType = {
    variant: "text" | "outlined" | "contained"
    onClick: () => void
    color: "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning"
    title: string
}

const ButtonWithMemo = React.memo((props: ButtonWithMemoPropsType) => {
    return (
        <Button variant={props.variant}
                onClick={props.onClick}
                color={props.color}>
            {props.title}
        </Button>
    )
})
