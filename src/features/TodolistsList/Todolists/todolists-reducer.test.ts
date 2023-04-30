import {v1} from "uuid";
import {
	changeTodolistEntityStatusAC,
	changeTodolistFilterAC,
	changeTodolistTitleAC, createTodolistTC, deleteTodolistTC, FilterValuesType, getTodolistsTC, TodolistDomainType,
	todolistsReducer
} from "./todolists-reducer";
import {RequestStatusType} from "app/app-reducer";


let todolistId1: string
let todolistId2: string
let startState: Array<TodolistDomainType>

beforeEach(() => {
	todolistId1 = v1();
	todolistId2 = v1();

	startState = [
		{id: todolistId1, title: "What to learn", filter: "all", addedDate: "", order: 0, entityStatus: 'idle'},
		{id: todolistId2, title: "What to buy", filter: "all", addedDate: "", order: 0, entityStatus: 'idle'}
	]
})

test('correct todolist should be removed', () => {
const param = {id: todolistId1}
	const endState = todolistsReducer(startState, deleteTodolistTC.fulfilled(param, '', todolistId1))

	expect(endState.length).toBe(1)
	expect(endState[0].id).toBe(todolistId2)
});

test('correct todolist should be added', () => {

	const newTodolistTitle = 'List'

	const endState = todolistsReducer(startState, createTodolistTC.fulfilled({
		todolist: {
			id: 'todolistId1',
			title: newTodolistTitle,
			addedDate: "",
			order: 0
		}
	}, 'requiredId', newTodolistTitle))

	expect(endState.length).toBe(3);
	expect(endState[0].title).toBe(newTodolistTitle);
});


test('correct filter of todolist should be changed', () => {

	let newFilter: FilterValuesType = "completed";

	const endState = todolistsReducer(startState, changeTodolistFilterAC({id: todolistId2, filter: newFilter}));

	expect(endState[0].filter).toBe("all");
	expect(endState[1].filter).toBe(newFilter);
});

test('title of todolist should be changed', () => {
	let newTitle = "New name";

	const endState = todolistsReducer(startState, changeTodolistTitleAC({id: todolistId2, title: newTitle}));

	expect(endState[0].title).toBe("What to learn");
	expect(endState[1].title).toBe("New name");
});

test('title should be set to the state', () => {
	const param = {todolists: startState}
	const action = getTodolistsTC.fulfilled(param, 'requestId')
	const endState = todolistsReducer([], action);

	expect(endState.length).toBe(2);
});

test('correct entity status of todolist should be changed', () => {

	let newStatus: RequestStatusType = "loading";

	const endState = todolistsReducer(startState, changeTodolistEntityStatusAC({
		todoListId: todolistId2,
		status: newStatus
	}));

	expect(endState[0].entityStatus).toBe("idle");
	expect(endState[1].entityStatus).toBe(newStatus);
});
