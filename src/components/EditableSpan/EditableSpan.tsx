import React, {ChangeEvent, useState, KeyboardEvent} from "react";
import {TextField} from "@mui/material";


type EditableSpanPropsType = {
    title: string
    changeTitle: (title: string) => void
}

export const EditableSpan = React.memo((props: EditableSpanPropsType) => {
    const [editMode, setEditMode] = useState<boolean>(false)
    const [title, setTitle] = useState<string>(props.title);
    const onEditMode = () => setEditMode(true)

    const offEditMode = () => {
        props.changeTitle(title)
        setEditMode(false)
    }

    const changeTitle = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    };

    const EnterChangeTitle = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            offEditMode();
        }
    }

    return (
        editMode
            ? <TextField
                    variant={'standard'}
                    value={title}
                    autoFocus
                    onBlur={offEditMode}
                    onChange={changeTitle}
                    onKeyDown={EnterChangeTitle}
            />
            : <span onDoubleClick={onEditMode}>
                    {props.title}
              </span>
    )
})