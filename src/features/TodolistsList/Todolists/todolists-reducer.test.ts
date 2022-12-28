import {v1} from "uuid";
import {
    addTodolistAC,
    changeTodolistFilterAC,
    changeTodolistTitleAC, FilterValuesType,
    removeTodolistAC, setTodolistsAC, TodolistDomainType,
    todolistsReducer
} from "./todolists-reducer";



let todolistId1: string
let todolistId2: string
let startState: Array<TodolistDomainType>

beforeEach(() => {
    todolistId1 = v1();
    todolistId2 = v1();

    startState = [
        {id: todolistId1, title: "What to learn", filter: "all", addedDate: "", order: 0},
        {id: todolistId2, title: "What to buy", filter: "all", addedDate: "", order: 0}
    ]
})

test('correct todolist should be removed', () => {

    const endState = todolistsReducer(startState, removeTodolistAC(todolistId1))

    expect(endState.length).toBe(1)
    expect(endState[0].id).toBe(todolistId2)
});

test('correct todolist should be added', () => {

    const newTodolistTitle = 'List'

    const endState = todolistsReducer(startState, addTodolistAC(newTodolistTitle, '1'))

    expect(endState.length).toBe(3);
    expect(endState[2].title).toBe(newTodolistTitle);
});


test('correct filter of todolist should be changed', () => {

    let newFilter: FilterValuesType = "completed";

    const endState = todolistsReducer(startState, changeTodolistFilterAC(todolistId2, newFilter));

    expect(endState[0].filter).toBe("all");
    expect(endState[1].filter).toBe(newFilter);
});

test('title of todolist should be changed', () => {
    let newTitle = "New name";

    const endState = todolistsReducer(startState, changeTodolistTitleAC(todolistId2, newTitle));

    expect(endState[0].title).toBe("What to learn");
    expect(endState[1].title).toBe("New name");
});

test('title should be set to the state', () => {

    const action = setTodolistsAC(startState)
    const endState = todolistsReducer([], action);

    expect(endState.length).toBe(2);
});
