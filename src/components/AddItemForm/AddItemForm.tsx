import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import {AddBox} from "@mui/icons-material";
import {IconButton, TextField} from "@mui/material";

export type AddItemFormSubmitHelperType = {
	setError: (error: string) => void, setTitle: (title: string) => void
}
type AddItemFormPropsType = {
	addItem: (title: string, helper: AddItemFormSubmitHelperType) => void
	disabled?: boolean
}

export const AddItemForm = React.memo(({addItem, disabled = false}: AddItemFormPropsType) => {
	const [title, setTitle] = useState<string>('');
	const [error, setError] = useState<string | null>(null)

	const changeTitle = (e: ChangeEvent<HTMLInputElement>) => {
		if (error !== null) setError(null)
		setTitle(e.currentTarget.value)
	};

	const addItemHandler =  () => {
		if (title.trim() !== '') {
			try {
				addItem(title.trim(), {setError, setTitle});
			} catch (e: any) {
				setError(e.message)
			}
		} else {
			setError('Title is require!')
		}
	};

	const onBlurHandler = () => {
		setError(null);
	}

	const onKeyPressHandler = async (e: KeyboardEvent<HTMLInputElement>) => {
		if (error !== null) setError(null);
		if (e.key === "Enter") {
			await addItemHandler()
			setTitle('');
		}
	};


	return (
		<div>
			<TextField
				disabled={disabled}
				variant={'outlined'}
				size={'small'}
				value={title}
				onBlur={onBlurHandler}
				onChange={changeTitle}
				onKeyDown={onKeyPressHandler}
				error={error !== null}
				label={'Title'}
				helperText={error}
			/>
			<IconButton
				disabled={disabled}
				onClick={addItemHandler}
				style={{marginLeft: 11}}
				onBlur={onBlurHandler}
			>
				<AddBox style={{color: 'db6b7c'}}/>
			</IconButton>
		</div>
	)
})