import React, {KeyboardEvent, ChangeEvent, useState} from "react";
import {FilterValuesType} from "./App";


type TodolistPropsType = {
    removeTodoList: (todoListId: string) => void
    filter: FilterValuesType
    todoListId: string
    title: string
    tasks: Array<TaskType>
    removeTask: (taskId: string, todoListId: string) => void
    addTask: (title: string, todoListId: string) => void
    changeStatus: (taskId: string, isDone: boolean, todoListId: string) => void
    changeFilter: (filter: FilterValuesType, todoListId: string) => void

}
export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

export const Todolist = (props: TodolistPropsType) => {
    const [newTaskTitle, setNewTaskTitle] = useState<string>('');
    const [error, setError] = useState<string | null>(null)


    const onNewTitleChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setNewTaskTitle(e.currentTarget.value)
    };

    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        setError(null);
        if (e.charCode === 13) {
            addTask()
            setNewTaskTitle('');
        }
    };

    const addTask = () => {
        if (newTaskTitle.trim() !== '') {
            props.addTask(newTaskTitle.trim(), props.todoListId);
            setNewTaskTitle('');
        } else {
            setError('Title is required')
        }
    };

    const onClickHandler = (filter: FilterValuesType, todoListId: string) => {
        return () => props.changeFilter(filter, todoListId);
    };

    const onRemoveHandler = (id: string, todoListId: string) => {
        props.removeTask(id, todoListId)
    };

    const onChangeHandler = (taskID: string, e: ChangeEvent<HTMLInputElement>, todoListId: string) => {
        props.changeStatus(taskID, e.currentTarget.checked, todoListId)

    }


    return (
        <div className="App">
            <div>
                <h3>{props.title}
                    <button onClick={() => {props.removeTodoList(props.todoListId)}}>X</button>
                </h3>
                <div>
                    <input value={newTaskTitle}
                           onChange={onNewTitleChangeHandler}
                           onKeyPress={onKeyPressHandler}
                           className={error ? "error" : ''}
                    />
                    <button onClick={addTask}>+</button>
                    {error && <div className="error-message">{error}</div>}
                </div>
                <ul>
                    {props.tasks.map(
                        el => {
                            return <li key={el.id} className={el.isDone ? "isDone" : ''}>
                                <input
                                    type="checkbox"
                                    checked={el.isDone}
                                    onChange={(event) => onChangeHandler(el.id, event, props.todoListId)}
                                />
                                <span>{el.title}</span>
                                <button onClick={() => onRemoveHandler(el.id, props.todoListId)}>x
                                </button>
                            </li>
                        })}
                </ul>
                <div>
                    <button className={props.filter === 'all' ? "active-filter" : ''} onClick={onClickHandler('all' , props.todoListId)}>All</button>
                    <button className={props.filter === 'active' ? "active-filter" : ''} onClick={onClickHandler('active' , props.todoListId)}>Active</button>
                    <button className={props.filter === 'completed' ? "active-filter" : ''} onClick={onClickHandler('completed' , props.todoListId)}>Completed</button>
                </div>
            </div>
        </div>)
};

