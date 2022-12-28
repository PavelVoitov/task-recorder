import React, {useCallback, useEffect} from 'react';
import {AddItemForm} from '../../../components/AddItemForm/AddItemForm';
import {EditableSpan} from '../../../components/EditableSpan/EditableSpan';
import {Delete} from "@mui/icons-material";
import {Button, IconButton} from "@mui/material";
import {Task} from "./Task/Task";
import {TaskStatuses, TaskType} from "../../../api/todolist-api";
import {FilterValuesType} from "./todolists-reducer";
import {AppDispatch} from "../../../app/store";
import {setTasksTC} from "./tasks-reducer";


type PropsType = {
    id: string
    title: string
    tasks: Array<TaskType>
    changeFilter: (value: FilterValuesType, todolistId: string) => void
    addTask: (todolistId: string, title: string,) => void
    removeTodolist: (id: string) => void
    changeTodolistTitle: (id: string, newTitle: string) => void
    filter: FilterValuesType
}


export const Todolist = React.memo((props: PropsType) => {
    const dispatch = AppDispatch();
    useEffect(() => {
        dispatch(setTasksTC(props.id))
    }, [])
    const addTask = useCallback((title: string) => {
        props.addTask(props.id, title);
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
        tasksForTodolist = tasksForTodolist.filter(t => t.status === TaskStatuses.New);
    }
    if (props.filter === "completed") {
        tasksForTodolist = tasksForTodolist.filter(t => t.status === TaskStatuses.Completed);
    }


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
                    return <Task key={t.id}
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
