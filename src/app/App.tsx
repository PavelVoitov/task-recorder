import React, {memo} from 'react';
import './App.css';
import {AppBar, Button, Container, IconButton, LinearProgress, Toolbar, Typography} from "@mui/material";
import {Menu} from "@mui/icons-material";
import {TaskType} from "../api/todolist-api";
import {TodolistsList} from "../features/TodolistsList/TodolistsList";
import {AppRootStateType} from "./store";
import {ErrorSnackbars} from "../components/ErrorSnackbar/ErrorSnackbar";
import {useSelector} from "react-redux";
import {RequestStatusType} from "./app-reducer";


export type TasksStateType = {
    [key: string]: Array<TaskType>
}

type AppPropsType = {
    demo?: boolean
}

const App = memo(({demo = false}: AppPropsType) => {
    const status = useSelector<AppRootStateType, RequestStatusType>(
        state => state.app.status
    )
    return (
        <div className="App">
            <ErrorSnackbars/>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
                {status === 'loading' ? <LinearProgress /> : ''}
            </AppBar>
            <Container fixed>
                <TodolistsList demo={demo}/>
            </Container>
        </div>
    );
})


export default App;
