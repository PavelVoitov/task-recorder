import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import {action} from "@storybook/addon-actions";
import {Task} from "./Task";


export default {
    title: 'TODOLIST/Task',
    component: Task,
    args: {
        changeTaskStatus: action('change Task Status'),
        changeTaskTitle: action('change Task Title'),
        removeTask: action('remove Task'),
        task: {id: '1', isDone: true, title: 'JS'},
        todolistId: 'todolistId1'
    },
} as ComponentMeta<typeof Task>;

const Template: ComponentStory<typeof Task> = (args) => <Task {...args} />;


export const TaskIsDoneStory = Template.bind({});
TaskIsDoneStory.args = {};

export const TaskIsNotDoneStory = Template.bind({});
TaskIsNotDoneStory.args = {
    task: {id: '2', isDone: false, title: 'HTML'},
};

