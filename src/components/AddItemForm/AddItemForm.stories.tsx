import React from 'react';
import {ComponentMeta} from '@storybook/react';
import {AddItemForm} from "./AddItemForm";
import {action} from "@storybook/addon-actions";


export default {
	title: 'TODOLIST/AddItemForm',
	component: AddItemForm,
	argTypes: {
		addItem: {description: 'Button clicked inside form'},
	},
} as ComponentMeta<typeof AddItemForm>;

const asyncCallback = async (...params: any) => {
	action('Button clicked inside form')(params)
}

export const AddItemFormStory = () => {
	return <AddItemForm disabled={false} addItem={asyncCallback}/>
}

export const AddItemFormDisabledExample = () => {
	return <AddItemForm disabled={true} addItem={asyncCallback}/>
}

