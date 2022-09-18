import React, {useState} from 'react';
import {TaskType, Todolist} from './Todolist';
import './App.css';
import {v1} from "uuid";

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

    const changeStatus = (taskId: string, isDone: boolean, todoListId: string) => {
        const todoListTasks = tasks[todoListId]
        const updatedTasks = todoListTasks.map(el => el.id === taskId ? {...el, isDone} : el)
        const copyTasks = {...tasks}
        copyTasks[todoListId] = updatedTasks
        setTasks(copyTasks);
    }

    const changeFilter = (filter: FilterValuesType, todoListId: string) => {
        setTodoLists(todoLists.map(el => el.id === todoListId ? {...el, filter} : el))
    }

    const removeTodoList = (todoListId: string) => {
        setTodoLists(todoLists.filter(el => el.id !== todoListId))
    }

    const getTasksForTodoList = (todoLists: TodoListType) => {
        if (todoLists.filter === 'active') {
           return  tasks[todoLists.id].filter(el => !el.isDone);
        } else if (todoLists.filter === 'completed') {
           return  tasks[todoLists.id].filter(el => el.isDone);
        } else {
            return tasks[todoLists.id]
        }

    }



    const todoListComponents = todoLists.map(el => {
            const task = getTasksForTodoList(el)

        return (<Todolist
                            changeFilter={changeFilter}
                            removeTodoList={removeTodoList}
                            key={el.id}
                            todoListId={el.id}
                            filter={el.filter}
                            title={el.title}
                            tasks={task}
                            removeTask={removeTask}
                            addTask={addTask}
                            changeStatus={changeStatus}

                />
            )
        }
    )

    return (
        <div className="App">
            {todoListComponents}
        </div>
    );
}

export default App;
