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
import {ErrorSnackbars} from "components/ErrorSnackbar/ErrorSnackbar";
import {Navigate, Route, Routes} from "react-router-dom";
import {authActions, authSelectors, Login} from "features/Auth";
import {selectIsInitialized, selectStatus} from "app/selectors";
import {useActions, useAppSelector} from "utils/redux-utils";
import {appActions} from "features/Application";


export type TasksStateType = {
	[key: string]: Array<TaskType>
}

const App = memo(() => {
	const status = useAppSelector(selectStatus)
	const isInitialized = useAppSelector(selectIsInitialized)
	const isLoggedIn = useAppSelector(authSelectors.selectIsLoggedIn)

	const {logout} = useActions(authActions)
	const {initializeApp} = useActions(appActions)

	useEffect(() => {
		if (!isInitialized) {
			initializeApp()
		}
	}, [])

	const logOutHandler = useCallback(() => {
		logout()
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
				{status === 'loading' ? <LinearProgress sx={{height: 5}}/> : <div style={{height: 5}}></div>}
			</AppBar>
			<Container fixed>
				<Routes>
					<Route path='/' element={<TodolistsList demo={false}/>}/>
					<Route path='/login' element={<Login/>}/>
					<Route path='/404' element={<h1>404: PAGE NOT FOUND</h1>}/>
					<Route path='*' element={<Navigate to='/404'/>}/>
				</Routes>
			</Container>
		</div>
	);
})


export default App;
