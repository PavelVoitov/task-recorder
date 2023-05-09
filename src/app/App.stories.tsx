import React from 'react';
import App from "./App";
import {ReduxStoreProviderDecorator} from "stories/ReduxStoreProviderDecorator";




export default {
    title: 'TODOLIST/Application',
    component: App,
    decorators: [ReduxStoreProviderDecorator]
}

export const AppBaseExample = () => {
    return <App demo={true}/>
}






