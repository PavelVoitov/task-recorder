import {v1} from "uuid";
import {FilterValuesType, TodoListType} from "../App";
import {
    AddTodoListAC,
    ChangeTodoFilterAC,
    ChangeTodoTitleAC,
    RemoveTodoListAC,
    todolistsReducer
} from './todolists-reducer'


let todolistId1: string
let todolistId2: string

let startState: Array<TodoListType>

beforeEach(() => {
    let todolistId1 = v1();
    let todolistId2 = v1();

    startState = [
        {id: todolistId1, title: "What to learn", filter: "all"},
        {id: todolistId2, title: "What to buy", filter: "all"}
    ]
})

test('correct todolist should be removed', () => {

    const endState = todolistsReducer(startState, RemoveTodoListAC(todolistId1))

    expect(endState.length).toBe(1);
    expect(endState[0].id).toBe(todolistId2);
});

test('correct todolist should be added', () => {

    const newTodolistTitle = 'List'

    const endState = todolistsReducer(startState, AddTodoListAC(newTodolistTitle))

    expect(endState.length).toBe(3);
    expect(endState[2].title).toBe(newTodolistTitle);
});


test('correct filter of todolist should be changed', () => {

    let newFilter: FilterValuesType = "completed";

    const endState = todolistsReducer(startState, ChangeTodoFilterAC(todolistId2, newFilter));

    expect(endState[0].filter).toBe("all");
    expect(endState[1].filter).toBe(newFilter);
});

test('title of todolist should be changed', () => {

    let newTitle = "New name";

    const endState = todolistsReducer(startState, ChangeTodoTitleAC(newTitle, todolistId2));

    expect(endState[0].title).toBe("What to learn");
    expect(endState[1].title).toBe("New name");
});
