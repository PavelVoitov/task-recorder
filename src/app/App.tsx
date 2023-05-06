import React, {memo, useCallback, useEffect} from 'react';
import './App.css';
import {
    AppBar,
    Button,
    CircularProgress,
    Container,
    IconButton,
    LinearProgress,
    Toolbar,
    Typography
} from "@mui/material";
import {Menu} from "@mui/icons-material";
import {TaskType} from "api/todolists-api";
import {TodolistsList} from "features/TodolistsList";
import {AppDispatch, useAppSelector} from "./store";
import {ErrorSnackbars} from "components/ErrorSnackbar/ErrorSnackbar";
import {Navigate, Route, Routes} from "react-router-dom";
import {Login} from "features/Auth";
import {authSelectors} from 'features/Auth';
import {selectIsInitialized, selectStatus} from "app/selectors";
import {initializeAppTC} from "app/app-actions";
import {logoutTC} from "features/Auth/auth-actions";


export type TasksStateType = {
    [key: string]: Array<TaskType>
}

type AppPropsType = {
    demo?: boolean
}

const App = memo(({demo = false}: AppPropsType) => {
    const status = useAppSelector(selectStatus)
    const isInitialized = useAppSelector(selectIsInitialized)
    const isLoggedIn = useAppSelector(authSelectors.selectIsLoggedIn)
    const dispatch = AppDispatch()

    useEffect(() => {
        if (!demo) {
            dispatch(initializeAppTC())
        }
    }, [])

    const logOutHandler = useCallback(() => {
        dispatch(logoutTC())
    }, [])

    if (!isInitialized) {
        return (
            <div style={{position: "absolute", marginLeft: '50%', marginRight: '50%', marginTop: '30%'}}>
                <CircularProgress/>
            </div>
        )
    }

    return (
            <div className="App">
                <ErrorSnackbars/>
                <AppBar position="static" color={'primary'}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" aria-label="menu">
                            <Menu/>
                        </IconButton>
                        <Typography variant="h6">
                            News
                        </Typography>
                        {isLoggedIn ? <Button color="inherit" onClick={logOutHandler}>Logout</Button> : ''}
                    </Toolbar>
                    {status === 'loading' ?  <LinearProgress sx={{height: 5}}/> : <div style={{height: 5}}></div>}
                </AppBar>
                <Container fixed>
                    <Routes>
                        <Route path='/' element={<TodolistsList demo={demo}/>}/>
                        <Route path='/login' element={<Login/>}/>
                        <Route path='/404' element={<h1>404: PAGE NOT FOUND</h1>}/>
                        <Route path='*' element={<Navigate to='/404'/>}/>
                    </Routes>
                </Container>
            </div>
    );
})


export default App;
