import React, {ChangeEvent, KeyboardEvent, useState} from "react";


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
            <input value={title}
                   onChange={changeTitle}
                   onKeyDown={onKeyPressHandler}
                   className={error ? "error" : ''}
            />
            <button onClick={addItem}>+</button>
            {userMessage}
        </div>
    )
}