import React, {ChangeEvent} from "react";
import {FilterValuesType} from "./App";
import {AddItemForm} from './AddItemForm'
import {EditableSpan} from "./EditableSpan";


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
    changeTaskTitle: (taskId: string, title: string, todoListId: string) => void
    changeTodoTitle: (title: string, todoListId: string) => void

}
export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

export const Todolist = (props: TodolistPropsType) => {


    const addTask = (title: string) => {
        props.addTask(title, props.todoListId)
    };

    const onClickHandler = (filter: FilterValuesType, todoListId: string) => {
        return () => props.changeFilter(filter, todoListId);
    };

    const onRemoveTaskHandler = (id: string, todoListId: string) => {
        props.removeTask(id, todoListId)
    };

    const onChangeHandler = (taskID: string, e: ChangeEvent<HTMLInputElement>, todoListId: string) => {
        props.changeStatus(taskID, e.currentTarget.checked, todoListId)

    }

    const changeTodoTitle = (title: string) => {
        props.changeTodoTitle(title, props.todoListId)
    }


    return (
        <div className="App">
            <div>
                <h3>
                    <EditableSpan
                        title={props.title}
                        changeTitle={changeTodoTitle}
                    />
                    <button onClick={() => {
                        props.removeTodoList(props.todoListId)
                    }}>X</button>
                </h3>
                <AddItemForm addItem={addTask}/>
                <ul>
                    {props.tasks.map(
                        el => {
                            const changeTaskTitle = (title: string) => {
                                props.changeTaskTitle(el.id, title, props.todoListId)
                            }
                            return <li key={el.id} className={el.isDone ? "isDone" : ''}>
                                <input
                                    type="checkbox"
                                    checked={el.isDone}
                                    onChange={(event) => onChangeHandler(el.id, event, props.todoListId)}
                                />
                                <EditableSpan
                                    title={el.title}
                                    changeTitle={changeTaskTitle}
                                />
                                <button onClick={() => onRemoveTaskHandler(el.id, props.todoListId)}>x</button>
                            </li>
                        })}
                </ul>
                <div>
                    <button className={props.filter === 'all' ? "active-filter" : ''}
                            onClick={onClickHandler('all', props.todoListId)}>All
                    </button>
                    <button className={props.filter === 'active' ? "active-filter" : ''}
                            onClick={onClickHandler('active', props.todoListId)}>Active
                    </button>
                    <button className={props.filter === 'completed' ? "active-filter" : ''}
                            onClick={onClickHandler('completed', props.todoListId)}>Completed
                    </button>
                </div>
            </div>
        </div>)
};

