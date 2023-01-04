import React from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import {action} from "@storybook/addon-actions";
import {TaskStatuses, TaskPriorities} from "../../../../api/todolists-api";
import {ReduxStoreProviderDecorator} from "../../../../stories/ReduxStoreProviderDecorator";
import { Task } from './Task';


export default {
    title: 'TODOLIST/Task',
    component: Task,
    decorators: [ReduxStoreProviderDecorator],
    args: {
        changeTaskStatus: action('change Task Status'),
        changeTaskTitle: action('change Task Title'),
        removeTask: action('remove Task'),
    },
} as ComponentMeta<typeof Task>;

const Template: ComponentStory<typeof Task> = (args) => <Task {...args} />;


export const TaskIsDoneStory = Template.bind({});
TaskIsDoneStory.args = {
    task: {
        id: '1',
        status: TaskStatuses.Completed,
        title: 'JS',
        description: 'string',
        priority: TaskPriorities.Low,
        startDate: '',
        deadline: '',
        todoListId: '1',
        order: 0,
        addedDate: ''
    },
};

export const TaskIsNotDoneStory = Template.bind({});
TaskIsNotDoneStory.args = {
    task: {
        id: '2',
        status: TaskStatuses.New,
        title: 'HTML',
        description: 'string',
        priority: TaskPriorities.Low,
        startDate: '',
        deadline: '',
        todoListId: '2',
        order: 0,
        addedDate: ''
    },
};

