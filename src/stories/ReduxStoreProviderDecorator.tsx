import React from 'react';
import {Provider} from "react-redux";
import {AppRootStateType} from "../app/store";
import {combineReducers, legacy_createStore} from "redux";
import {tasksReducer} from "../features/TodolistsList/Todolists/tasks-reducer";
import {todolistsReducer} from "../features/TodolistsList/Todolists/todolists-reducer";
import {v1} from "uuid";
import {TaskStatuses, TaskPriorities} from "../api/todolist-api";

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer
})

const initialGlobalState: AppRootStateType = {
    todolists: [
        {id: "todolistId1", title: "What to learn", addedDate: '',
            order: 0, filter: "all"},
        {id: "todolistId2", title: "What to buy", addedDate: '',
            order: 0, filter: "all"}
    ] ,
    tasks: {
        ["todolistId1"]: [
            {id: v1(), title: "HTML&CSS", status: TaskStatuses.Completed, todoListId: "todolistId1",
            description: '', startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low
            },
            {id: v1(), title: "JS", status: TaskStatuses.Completed, todoListId: "todolistId1",
                description: '', startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low,
                }
        ],
        ["todolistId2"]: [
            {id: v1(), title: "Milk", status: TaskStatuses.New, todoListId: "todolistId2",
                description: '', startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low,
                },
            {id: v1(), title: "React Book", status: TaskStatuses.Completed, todoListId: "todolistId2",
                description: '', startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low,
                }
        ]
    }
};

export const storyBookStore = legacy_createStore(rootReducer, initialGlobalState);


export const ReduxStoreProviderDecorator = (storyFn: () => React.ReactNode) => {
    return <Provider store={storyBookStore}>
        {storyFn()}
    </Provider>
}