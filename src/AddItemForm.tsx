import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import AddBoxIcon from '@material-ui/icons/AddBox';
import {AddBox} from "@material-ui/icons";
import {IconButton, TextField} from "@material-ui/core";

type AddItemFormPropsType = {
    addItem: (title: string) => void
}

export const AddItemForm = (props:AddItemFormPropsType) => {
    const [title, setTitle] = useState<string>('');
    const [error, setError] = useState<boolean>(false)

    const changeTitle = (e: ChangeEvent<HTMLInputElement>) => {
        if (error) setError(false)
        setTitle(e.currentTarget.value)
    };

    const addItem = () => {
        if (title.trim() !== '') {
            props.addItem(title.trim());
            setTitle('');
        } else {
            setError(true)
        }
    };

    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        setError(false);
        if (e.key === "Enter") {
            addItem()
            setTitle('');
        }
    };

    const userMessage =
        error
            ? <div style={{color: 'hotpink'}}>Title is require</div>
            : <div>Please, create list item's title</div>


    return (
        <div>
            <TextField
                variant={'outlined'}
                size={'small'}
                // style={{padding: 0, height: '5px'}}
                value={title}
                onChange={changeTitle}
                onKeyDown={onKeyPressHandler}
                error={error}
                label={'Title'}
                helperText={error && 'Title is require!'}
            />
            <IconButton
                onClick={addItem}>
                <AddBox style={{color: 'db6b7c'}}/>
            </IconButton>
            {/*{userMessage}*/}
        </div>
    )
}