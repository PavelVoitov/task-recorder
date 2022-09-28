import React, {useState} from 'react';
import {TaskType, Todolist} from './Todolist';
import './App.css';
import {v1} from "uuid";
import {AddItemForm} from "./AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@material-ui/core";
import {Menu} from "@material-ui/icons";

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


    const [todoLists, setTodoLists] = useState<Array<TodoListType>>(
        [
            {id: todoList1, title: 'What to learn', filter: "all"},
            {id: todoList2, title: 'What to sell', filter: "all"},

        ]
    )

    const [tasks, setTasks] = useState<TasksStateType>({
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
        const todoListTasks = tasks[todoListId]
        let updatedTasks = todoListTasks.filter((el) => el.id !== taskId);
        const copyTasks = {...tasks}
        copyTasks[todoListId] = updatedTasks
        setTasks(copyTasks);

    };
    const addTask = (title: string, todoListId: string) => {
        let newTask = {
            id: v1(),
            title: title,
            isDone: false
        };
        const todoListTasks = tasks[todoListId]
        let updatedTasks = [newTask, ...todoListTasks]
        const copyTasks = {...tasks}
        copyTasks[todoListId] = updatedTasks
        setTasks(copyTasks);
    };
    const changeTaskStatus = (taskId: string, isDone: boolean, todoListId: string) => {
        setTasks({
            ...tasks, [todoListId]: tasks[todoListId].map(el => el.id === taskId ? {
                ...el, isDone
            } : el)
        });
    }
    const changeTaskTitle = (taskId: string, title: string, todoListId: string) => {
        setTasks({
            ...tasks, [todoListId]: tasks[todoListId].map(el => el.id === taskId ? {
                ...el, title
            } : el)
        });
    }

//todoList CRUD
    const changeTodoFilter = (filter: FilterValuesType, todoListId: string) => {
        setTodoLists(todoLists.map(el => el.id === todoListId ? {...el, filter} : el))
    }
    const changeTodoTitle = (title: string, todoListId: string) => {
        setTodoLists(todoLists.map(el => el.id === todoListId ? {...el, title} : el))
    }
    const removeTodoList = (todoListId: string) => {
        setTodoLists(todoLists.filter(el => el.id !== todoListId))
    }
    const addTodoList = (title: string) => {
        const newTodoListId = v1();
        setTodoLists([...todoLists, {id: newTodoListId, title, filter: "all"}]);
        setTasks({...tasks, [newTodoListId]: []})
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
                <Grid item >
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
                        <Menu />
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
