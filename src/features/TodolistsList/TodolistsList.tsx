import React, {useCallback, useEffect} from "react";
import {TodolistDomainType} from "./Todolists/todolists-reducer";
import {Grid} from "@mui/material";
import {AddItemForm, AddItemFormSubmitHelperType} from "components/AddItemForm/AddItemForm";
import {Todolist} from "./Todolists/Todolist";
import {TasksStateType} from "app/App";
import {Navigate} from "react-router-dom";
import {selectIsLoggedIn} from "features/Auth/selectors";
import {todolistsActions} from "./index";
import {AppDispatch, useActions, useAppSelector} from "utils/redux-utils";

type TodolistsListPropsType = {
	demo?: boolean
}

export const TodolistsList: React.FC<TodolistsListPropsType> = ({demo = false}) => {
	const dispatch = AppDispatch()
	const todolists = useAppSelector<Array<TodolistDomainType>>(state => state.todolists)
	const tasks = useAppSelector<TasksStateType>(state => state.tasks)
	const isLoggedIn = useAppSelector(selectIsLoggedIn)

	const {getTodolists} = useActions(todolistsActions)

	const addTodolistCallback = useCallback(async (title: string, helper: AddItemFormSubmitHelperType) => {
		const resultAction = await dispatch(todolistsActions.addTodolist(title))
		if (todolistsActions.addTodolist.rejected.match(resultAction)) {
			if (resultAction.payload?.errors?.length) {
				const errorMessage = resultAction.payload.errors[0]
				helper.setError(errorMessage)
			} else {
				helper.setError("Some error occurred")
			}
		} else {
			helper.setTitle('')
		}
	}, [])

	useEffect(() => {
		if (demo || !isLoggedIn) {
			return
		}
		if (!todolists.length) {
			getTodolists()
		}
	}, [])

	if (!isLoggedIn) {
		return <Navigate to={'/login'}/>
	}

	return <>
		<Grid container style={{padding: "20px"}}>
			<AddItemForm addItem={addTodolistCallback}/>
		</Grid>
		<Grid container spacing={3} style={{flexWrap: 'nowrap', overflowX: "scroll"}}>
			{todolists.map((tl: TodolistDomainType) => {
				return <Grid item key={tl.id}>
					<div style={{margin: 10, width: 300}}>
						<Todolist
							todolist={tl}
							tasks={tasks[tl.id]}
							demo={demo}
						/>
					</div>
				</Grid>
			})
			}
		</Grid>
	</>
}