import React, {ChangeEvent} from "react";
import {FilterValuesType} from "./AppWithRedux";
import {EditableSpan} from "./EditableSpan";
import {Button, ButtonGroup, Checkbox, IconButton, List, ListItem} from "@material-ui/core";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import {AddItemForm} from "./AddItemForm";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./reducers/store";
import {TaskType} from "./Todolist";
import {ChangeTodoFilterAC, ChangeTodoTitleAC, RemoveTodoListAC} from "./reducers/todolists-reducer";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "./reducers/tasks-reducer";

export type TodolistWithReduxPropsType = {
    todoListId: string
    title: string
    filter: FilterValuesType
}

export const TodolistWithRedux = ({todoListId, title, filter}: TodolistWithReduxPropsType) => {

    let tasks = useSelector<AppRootStateType, Array<TaskType>>(state => state.tasks[todoListId])
    const dispatch = useDispatch()


    const changeTodoTitle = (title: string) => {
        dispatch(ChangeTodoTitleAC(title, todoListId))
    }

    const removeTodoList = () => {
        dispatch(RemoveTodoListAC(todoListId))
    }

    const addTask = () => {
        dispatch(addTaskAC(title, todoListId))
    }

    const onAllClickHandler = () => {
        dispatch(ChangeTodoFilterAC(todoListId, 'all'))
    };
    const onActiveClickHandler = () => {
        dispatch(ChangeTodoFilterAC(todoListId, 'active'))
    };
    const onCompletedClickHandler = () => {
        dispatch(ChangeTodoFilterAC(todoListId, 'completed'))
    };

    if (filter === 'active') {
        tasks = tasks.filter(el => !el.isDone);
    }
    if (filter === 'completed') {
        tasks = tasks.filter(el => el.isDone);
    }


    return (
        <div className="App">
            <div>
                <h3>
                    <EditableSpan
                        title={title}
                        changeTitle={changeTodoTitle}
                    />
                    <IconButton
                        size='small'
                        onClick={removeTodoList}
                        color={'primary'}
                    >
                        <DeleteForeverIcon/>
                    </IconButton>
                </h3>
                <AddItemForm addItem={addTask}/>
                <List>
                    {tasks.map(el => {
                        const onRemoveTaskHandler = () => dispatch(removeTaskAC(el.id, todoListId))
                        const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) =>  {
                            let newIsDoneValue = e.currentTarget.checked
                            dispatch(changeTaskStatusAC(el.id, newIsDoneValue, todoListId))
                        }
                            const changeTaskTitle = (title: string) => {
                                dispatch(changeTaskTitleAC(el.id, title, todoListId))
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
                                    onChange={onChangeHandler}
                                />
                                <EditableSpan
                                    title={el.title}
                                    changeTitle={changeTaskTitle}
                                />
                                <IconButton
                                    size='small'
                                    onClick={onRemoveTaskHandler}
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
                            color={filter === 'all' ? "secondary" : "primary"}
                            onClick={onAllClickHandler}>All
                        </Button>
                        <Button
                            color={filter === 'active' ? "secondary" : "primary"}
                            onClick={onActiveClickHandler}>Active
                        </Button>
                        <Button
                            color={filter === 'completed' ? "secondary" : "primary"}
                            onClick={onCompletedClickHandler}>Completed
                        </Button>
                    </ButtonGroup>

                </div>
            </div>
        </div>
    )
}