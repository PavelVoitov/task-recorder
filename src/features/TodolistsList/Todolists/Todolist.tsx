import React, {useCallback, useEffect} from 'react';
import {AddItemForm} from '../../../components/AddItemForm/AddItemForm';
import {EditableSpan} from '../../../components/EditableSpan/EditableSpan';
import {Delete} from "@mui/icons-material";
import {Button, IconButton} from "@mui/material";
import {Task} from "./Task/Task";
import {TaskStatuses, TaskType} from "../../../api/todolists-api";
import {FilterValuesType, TodolistDomainType} from "./todolists-reducer";
import {AppDispatch, useAppSelector} from "../../../app/store";
import {setTasksTC} from "./tasks-reducer";



type PropsType = {
    todolist: TodolistDomainType
    tasks: Array<TaskType>
    changeFilter: (value: FilterValuesType, todolistId: string) => void
    addTask: (todolistId: string, title: string,) => void
    removeTodolist: (id: string) => void
    changeTodolistTitle: (id: string, newTitle: string) => void
    demo?: boolean
}


export const Todolist = React.memo(({demo = false, ...props}: PropsType) => {
    const dispatch = AppDispatch()
    const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)


    useEffect(() => {
        if (demo || !isLoggedIn) {
            return
        }
       dispatch(setTasksTC(props.todolist.id))
    }, [])

    const addTask = useCallback((title: string) => {
        props.addTask(props.todolist.id, title);
    }, [props.addTask, props.todolist.id])

    const removeTodolist = useCallback(() => {
        props.removeTodolist(props.todolist.id);
    }, [props.removeTodolist, props.todolist.id])
    const changeTodolistTitle = useCallback((title: string) => {
        props.changeTodolistTitle(props.todolist.id, title);
    }, [props.changeTodolistTitle, props.todolist.id])

    const onAllClickHandler = useCallback(() => props.changeFilter("all", props.todolist.id), [props.changeFilter, props.todolist.id]);
    const onActiveClickHandler = useCallback(() => props.changeFilter("active", props.todolist.id), [props.changeFilter, props.todolist.id]);
    const onCompletedClickHandler = useCallback(() => props.changeFilter("completed", props.todolist.id), [props.changeFilter, props.todolist.id]);

    let tasksForTodolist = props.tasks;

    if (props.todolist.filter === "active") {
        tasksForTodolist = tasksForTodolist.filter(t => t.status === TaskStatuses.New);
    }
    if (props.todolist.filter === "completed") {
        tasksForTodolist = tasksForTodolist.filter(t => t.status === TaskStatuses.Completed);
    }


    return <div>
        <h3><EditableSpan title={props.todolist.title} changeTitle={changeTodolistTitle}/>
            <IconButton onClick={removeTodolist} disabled={props.todolist.entityStatus === 'loading'}>
                <Delete/>
            </IconButton>
        </h3>
        <AddItemForm addItem={addTask} disabled={props.todolist.entityStatus === 'loading'}/>
        <div>
            {
                tasksForTodolist?.map(t => {
                    return <Task key={t.id}
                                 task={t}
                                 todolistId={props.todolist.id}
                                 todolistStatus={props.todolist.entityStatus}
                    />
                })
            }
        </div>
        <div style={{paddingTop: "10px"}}>
            <ButtonWithMemo variant={props.todolist.filter === 'all' ? 'outlined' : 'text'}
                            onClick={onAllClickHandler}
                            color={'inherit'}
                            title={'ALL'}
            />
            <ButtonWithMemo
                variant={props.todolist.filter === 'active' ? 'outlined' : 'text'}
                onClick={onActiveClickHandler}
                color={'primary'}
                title={'Active'}
            />
            <ButtonWithMemo
                variant={props.todolist.filter === 'completed' ? 'outlined' : 'text'}
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
