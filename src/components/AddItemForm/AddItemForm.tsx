import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import {AddBox} from "@mui/icons-material";
import {IconButton, TextField} from "@mui/material";



type AddItemFormPropsType = {
    addItem: (title: string) => void
    disabled?: boolean
}

export const AddItemForm = React.memo(({addItem, disabled = false}:AddItemFormPropsType) => {
    const [title, setTitle] = useState<string>('');
    const [error, setError] = useState<boolean>(false)

    const changeTitle = (e: ChangeEvent<HTMLInputElement>) => {
        if (error) setError(false)
        setTitle(e.currentTarget.value)
    };

    const addItemHandler = () => {
        if (title.trim() !== '') {
            addItem(title.trim());
            setTitle('');
        } else {
            setError(true)
        }
    };

    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if  (error) setError(false);
        if (e.key === "Enter") {
            addItemHandler()
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
                onChange={changeTitle}
                onKeyDown={onKeyPressHandler}
                error={error}
                label={'Title'}
                helperText={error && 'Title is require!'}
            />
            <IconButton
                disabled={disabled}
                onClick={addItemHandler}>
                <AddBox style={{color: 'db6b7c'}}/>
            </IconButton>
        </div>
    )
})