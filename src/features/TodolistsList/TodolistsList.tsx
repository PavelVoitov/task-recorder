import React, {useCallback, useEffect} from "react";
import {
    changeTodolistFilterAC,
    createTodolistTC,
    deleteTodolistTC,
    FilterValuesType,
    getTodolistsTC,
    TodolistDomainType,
    updateTodolistTC
} from "./Todolists/todolists-reducer";
import {AppDispatch, useAppSelector} from "../../app/store";
import {addTasksTC} from "./Todolists/tasks-reducer";
import {Grid, Paper} from "@mui/material";
import {AddItemForm} from "../../components/AddItemForm/AddItemForm";
import {Todolist} from "./Todolists/Todolist";
import {TasksStateType} from "../../app/App";

type TodolistsListPropsType = {
    demo?: boolean
}

export const TodolistsList: React.FC<TodolistsListPropsType> = ({demo = false}) => {

    useEffect(() => {
        if (demo) {
            return
        }
        dispatch(getTodolistsTC())
    }, [])

    const todolists = useAppSelector<Array<TodolistDomainType>>(state => state.todolists)
    const tasks = useAppSelector<TasksStateType>(state => state.tasks)
    const dispatch = AppDispatch();

    const addTask = useCallback((todolistId: string, title: string,) => {
        dispatch(addTasksTC(todolistId, title));
    }, [dispatch])

    const changeFilter = useCallback((value: FilterValuesType, todolistId: string) => {
        const action = changeTodolistFilterAC(todolistId, value);
        dispatch(action);
    }, [dispatch])

    const removeTodolist = useCallback((id: string) => {
        dispatch(deleteTodolistTC(id))
    }, [dispatch])

    const changeTodolistTitle = useCallback((id: string, title: string) => {
        dispatch(updateTodolistTC(id, title))
    }, [dispatch])

    const addTodolist = useCallback((title: string) => {
        dispatch(createTodolistTC(title))
    }, [dispatch])

    return <>
        <Grid container style={{padding: "20px"}}>
            <AddItemForm addItem={addTodolist}/>
        </Grid>
        <Grid container spacing={3}>
            {
                todolists.map(tl => {
                    return <Grid item key={tl.id}>
                        <Paper style={{padding: "10px"}}>
                            <Todolist
                                todolist={tl}
                                tasks={tasks[tl.id]}
                                changeFilter={changeFilter}
                                addTask={addTask}
                                removeTodolist={removeTodolist}
                                changeTodolistTitle={changeTodolistTitle}
                                demo={demo}
                            />
                        </Paper>
                    </Grid>
                })
            }
        </Grid>
    </>
}