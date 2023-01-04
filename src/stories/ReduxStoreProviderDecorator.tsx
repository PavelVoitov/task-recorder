import React from 'react';
import {Provider} from "react-redux";
import {AppRootStateType} from "../app/store";
import {applyMiddleware, combineReducers, legacy_createStore} from "redux";
import {tasksReducer} from "../features/TodolistsList/Todolists/tasks-reducer";
import {todolistsReducer} from "../features/TodolistsList/Todolists/todolists-reducer";
import {v1} from "uuid";
import {TaskStatuses, TaskPriorities} from "../api/todolists-api";
import {appReducer} from "../app/app-reducer";
import thunk from "redux-thunk";

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer

})

const initialGlobalState: AppRootStateType = {
    todolists: [
        {id: "todolistId1", title: "What to learn", addedDate: '',
            order: 0, filter: "all", entityStatus: 'idle'},
        {id: "todolistId2", title: "What to buy", addedDate: '',
            order: 0, filter: "all", entityStatus: 'loading'}
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
    },
     app: {
        error: null,
         status: 'idle',
         isInitialized: true
     },
    auth: {
        isLoggedIn: true
    }
};

export const storyBookStore = legacy_createStore(rootReducer, initialGlobalState, applyMiddleware(thunk));


export const ReduxStoreProviderDecorator = (storyFn: () => React.ReactNode) => {
    return <Provider store={storyBookStore}>
        {storyFn()}
    </Provider>
}