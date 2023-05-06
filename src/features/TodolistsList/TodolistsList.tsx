import React, {useEffect} from "react";
import {TodolistDomainType} from "./Todolists/todolists-reducer";
import {useAction, useAppSelector} from "app/store";
import {Grid, Paper} from "@mui/material";
import {AddItemForm} from "components/AddItemForm/AddItemForm";
import {Todolist} from "./Todolists/Todolist";
import {TasksStateType} from "app/App";
import {Navigate} from "react-router-dom";
import {selectIsLoggedIn} from "features/Auth/selectors";
import {todolistsActions} from "./index";

type TodolistsListPropsType = {
	demo?: boolean
}

export const TodolistsList: React.FC<TodolistsListPropsType> = ({demo = false}) => {
	const todolists = useAppSelector<Array<TodolistDomainType>>(state => state.todolists)
	const tasks = useAppSelector<TasksStateType>(state => state.tasks)
	const isLoggedIn = useAppSelector(selectIsLoggedIn)

	const {getTodolists, createTodolist} = useAction(todolistsActions)

	useEffect(() => {
		if (demo || !isLoggedIn) {
			return
		}
		getTodolists()
	}, [])

	if (!isLoggedIn) {
		return <Navigate to={'/login'}/>
	}

	return <>
		<Grid container style={{padding: "20px"}}>
			<AddItemForm addItem={createTodolist}/>
		</Grid>
		<Grid container spacing={3}>
			{
				todolists.map(tl => {
					return <Grid item key={tl.id}>
						<Paper style={{padding: "10px"}}>
							<Todolist
								todolist={tl}
								tasks={tasks[tl.id]}
								demo={demo}
							/>
						</Paper>
					</Grid>
				})
			}
		</Grid>
	</>
}