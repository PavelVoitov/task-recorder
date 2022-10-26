import React from 'react';
import './App.css';
import {AddItemForm} from "./AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import {AddTodoListAC} from "./reducers/todolists-reducer";
import {AppRootStateType} from "./reducers/store";
import {useDispatch, useSelector} from "react-redux";
import {TodolistWithRedux} from './TodolistWithRedux'

export type FilterValuesType = "all" | "completed" | 'active';

export type TodoListType = {
    id: string
    title: string
    filter: FilterValuesType
}

// export type TasksStateType = {
//     [todoListId: string]: Array<TaskType>
// }

function App() {

    const todoLists = useSelector<AppRootStateType, Array<TodoListType>>(state => state.todolists)

    const dispatch = useDispatch()

    const addTodoList = (title: string) => {
        let action = AddTodoListAC(title)
        dispatch(action)
    }

    const todoListComponents = todoLists.map(el => {
            return (
                <Grid key={el.id} item>
                    <Paper elevation={10} style={{padding: '20px 20px'}}>
                        <TodolistWithRedux
                            todoListId={el.id}
                            filter={el.filter}
                            title={el.title}
                        />
                    </Paper>
                </Grid>
            )
        }
    )

    return (
        <div className="App">
            <AppBar position={'static'}>
                <Toolbar style={{justifyContent: "space-between"}}>
                    <IconButton
                        edge={'start'}
                        color={'inherit'}
                        aria-label={'menu'}>
                        <Menu/>
                    </IconButton>
                    <Typography variant={'h6'}>
                        TodoLists
                    </Typography>
                    <Button
                        color={'inherit'}
                        variant={'outlined'}
                    >
                        Login
                    </Button>
                </Toolbar>

            </AppBar>
            <Container fixed>
                <Grid container style={{padding: '20px 0'}} justifyContent={'center'}>
                    <AddItemForm addItem={addTodoList}/>
                </Grid>
                <Grid container spacing={5} justifyContent={'center'}>
                    {todoListComponents}
                </Grid>
            </Container>

        </div>
    );
}

export default App;
