import React, {ChangeEvent} from "react";
import {FilterValuesType} from "./App";
import {AddItemForm} from './AddItemForm'
import {EditableSpan} from "./EditableSpan";
import {Button, ButtonGroup, Checkbox, IconButton, List, ListItem} from "@material-ui/core";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';


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
                    <IconButton
                        size='small'
                        onClick={() => {
                            props.removeTodoList(props.todoListId)
                        }}
                        color={'primary'}
                    >
                        <DeleteForeverIcon/>
                    </IconButton>
                </h3>
                <AddItemForm addItem={addTask}/>
                <List>
                    {props.tasks.map(
                        el => {
                            const changeTaskTitle = (title: string) => {
                                props.changeTaskTitle(el.id, title, props.todoListId)
                            }
                            return <ListItem
                                        key={el.id}
                                        className={el.isDone ? "isDone" : ''}
                                        style={{padding: 0}}
                            >
                                <Checkbox
                                    style={{color: 'd07684'}}
                                    value="checkedA"
                                    checked={el.isDone}
                                    onChange={(event) => onChangeHandler(el.id, event, props.todoListId)}
                                />
                                <EditableSpan
                                    title={el.title}
                                    changeTitle={changeTaskTitle}
                                />
                                <IconButton
                                        size='small'
                                        onClick={() => onRemoveTaskHandler(el.id, props.todoListId)}
                                        color={'primary'}
                                >
                                        <DeleteForeverIcon/>
                                </IconButton>
                            </ListItem>
                        })}
                </List>
                <div>
                    <ButtonGroup size="small" color="secondary" aria-label="outlined primary button group"
                    >
                        <Button
                            color={props.filter === 'all' ? "secondary" : "primary"}
                            onClick={onClickHandler('all', props.todoListId)}>All
                        </Button>
                        <Button
                            color={props.filter === 'active' ? "secondary" : "primary"}
                            onClick={onClickHandler('active', props.todoListId)}>Active
                        </Button>
                        <Button
                            color={props.filter === 'completed' ? "secondary" : "primary"}
                            onClick={onClickHandler('completed', props.todoListId)}>Completed
                        </Button>
                    </ButtonGroup>

                </div>
            </div>
        </div>)
};

