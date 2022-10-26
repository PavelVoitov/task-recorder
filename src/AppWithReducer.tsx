import React, {useReducer} from 'react';
import {TaskType, Todolist} from './Todolist';
import './App.css';
import {v1} from "uuid";
import {AddItemForm} from "./AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import {
    AddTodoListAC,
    ChangeTodoFilterAC,
    ChangeTodoTitleAC,
    RemoveTodoListAC,
    todolistsReducer
} from "./reducers/todolists-reducer";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, tasksReducer} from "./reducers/tasks-reducer";

export type FilterValuesType = "all" | "completed" | 'active';

export type TodoListType = {
    id: string
    title: string
    filter: FilterValuesType
}

export type TasksStateType = {
    [todoListId: string]: Array<TaskType>
}

function App() {
    const todoList1 = v1();
    const todoList2 = v1();


    const [todoLists, dispatchToTodoLists] = useReducer(todolistsReducer, [
        {id: todoList1, title: 'What to learn', filter: "all"},
        {id: todoList2, title: 'What to sell', filter: "all"},
    ])

    const [tasks, dispatchToTasks] = useReducer(tasksReducer, {
        [todoList1]: [
            {id: v1(), title: "HTML&CSS", isDone: true},
            {id: v1(), title: "JS", isDone: true},
            {id: v1(), title: "ReactJS", isDone: false},
            {id: v1(), title: "Redux", isDone: false}
        ],
        [todoList2]: [
            {id: v1(), title: "Computer", isDone: true},
            {id: v1(), title: "HTC VIVE", isDone: false},

        ]
    })
//tasks CRUD
    const removeTask = (taskId: string, todoListId: string) => {
        dispatchToTasks(removeTaskAC(taskId, todoListId))

    };
    const addTask = (title: string, todoListId: string) => {
        dispatchToTasks(addTaskAC(title, todoListId))
    };
    const changeTaskStatus = (taskId: string, isDone: boolean, todoListId: string) => {
        dispatchToTasks(changeTaskStatusAC(taskId, isDone, todoListId))
    }

    const changeTaskTitle = (taskId: string, title: string, todoListId: string) => {
        dispatchToTasks(changeTaskTitleAC(taskId, title, todoListId))
    }

//todoList CRUD
    const changeTodoFilter = (filter: FilterValuesType, todoListId: string) => {
        dispatchToTodoLists(ChangeTodoFilterAC(todoListId, filter))
    }

    const changeTodoTitle = (title: string, todoListId: string) => {
        dispatchToTodoLists(ChangeTodoTitleAC(title, todoListId))
    }

    const removeTodoList = (todoListId: string) => {
        let action = RemoveTodoListAC(todoListId)
        dispatchToTasks(action)
        dispatchToTasks(action)
    }
    const addTodoList = (title: string) => {
        let action = AddTodoListAC(title)
        dispatchToTodoLists(action)
        dispatchToTasks(action)
    }

    const getTasksForTodoList = (todoLists: TodoListType) => {
        if (todoLists.filter === 'active') {
            return tasks[todoLists.id].filter(el => !el.isDone);
        } else if (todoLists.filter === 'completed') {
            return tasks[todoLists.id].filter(el => el.isDone);
        } else {
            return tasks[todoLists.id]
        }

    }


    const todoListComponents = todoLists.map(el => {
            const task = getTasksForTodoList(el)

            return (
                <Grid item>
                    <Paper elevation={10} style={{padding: '20px 20px'}}>
                        <Todolist
                            changeFilter={changeTodoFilter}
                            removeTodoList={removeTodoList}
                            key={el.id}
                            todoListId={el.id}
                            filter={el.filter}
                            title={el.title}
                            tasks={task}
                            removeTask={removeTask}
                            addTask={addTask}
                            changeStatus={changeTaskStatus}
                            changeTaskTitle={changeTaskTitle}
                            changeTodoTitle={changeTodoTitle}
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
