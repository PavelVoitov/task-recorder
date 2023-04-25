import {addTaskAC, removeTaskAC, tasksReducer, updateTaskAC} from './tasks-reducer'
import {TasksStateType} from "app/App";
import {addTodolistAC, removeTodolistAC, setTodolistsAC} from "./todolists-reducer";
import {TaskPriorities, TaskStatuses} from "api/todolists-api";


let startState: TasksStateType


beforeEach(() => {
    startState = {
        'todoListId1': [
            {
                id: '1',
                title: 'CSS',
                status: TaskStatuses.New,
                description: '',
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: 'todoListId1',
                order: 0,
                addedDate: ''
            },
            {
                id: '2',
                title: 'JS',
                status: TaskStatuses.Completed,
                description: '',
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: 'todoListId1',
                order: 0,
                addedDate: ''
            },
            {
                id: '3',
                title: 'React',
                status: TaskStatuses.New,
                description: '',
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: 'todoListId1',
                order: 0,
                addedDate: ''   }
        ],
        'todoListId2': [
            {
                id: '1',
                title: 'bread',
                status: TaskStatuses.New,
                description: '',
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: 'todoListId2',
                order: 0,
                addedDate: ''
            },
            {
                id: '2',
                title: 'milk',
                status: TaskStatuses.Completed,
                description: '',
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: 'todoListId2',
                order: 0,
                addedDate: ''
            },
            {
                id: '3',
                title: 'tea',
                status: TaskStatuses.New,
                description: '',
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: 'todoListId2',
                order: 0,
                addedDate: ''}
        ]
    }
})

test('correct task should be deleted from correct array', () => {

    const action = removeTaskAC({todolistId: 'todoListId2', taskId: '2'})

    const endState = tasksReducer(startState, action)

    expect(endState['todoListId2'][1]).toEqual({
        id: '3',
        title: 'tea',
        status: TaskStatuses.New,
        description: '',
        priority: TaskPriorities.Low,
        startDate: '',
        deadline: '',
        todoListId: 'todoListId2',
        order: 0,
        addedDate: ''})
})


test('status of specified task should be changed', () => {

    const action = updateTaskAC({taskId: '2', model: {status: TaskStatuses.New}, todolistId: 'todoListId2'})

    const endState = tasksReducer(startState, action)

    expect(endState['todoListId2'][1].status).toBe(TaskStatuses.New)
    expect(startState['todoListId2'][1].status).toBe(TaskStatuses.Completed)
})

test('title of specified task should be changed', () => {

    const newTitle = '1111'

    const action = updateTaskAC({taskId: '2', model: {title: newTitle}, todolistId: 'todoListId2'})

    const endState = tasksReducer(startState, action)

    expect(endState['todoListId2'][1].title).toBe('1111')
    expect(startState['todoListId2'][1].title).toBe('milk')
})

test('new array should be added when new todolist is added', () => {

    const action = addTodolistAC({todolist: {id: "1", title: "1",  addedDate: '', order: 0}})

    const endState = tasksReducer(startState, action)


    const keys = Object.keys(endState)
    const newKey = keys.find(k => k != 'todoListId1' && k != 'todoListId2')
    if (!newKey) {
        throw Error('new key should be added')
    }

    expect(keys.length).toBe(3)
    expect(endState[newKey]).toEqual([])
})

test('property with todolistId should be deleted', () => {

    const action = removeTodolistAC({id: 'todoListId2'})

    const endState = tasksReducer(startState, action)


    const keys = Object.keys(endState)

    expect(keys.length).toBe(1)
    expect(endState['todoListId2']).not.toBeDefined()
})

test('empty arrays should be added when we set todolists', () => {

    const action = setTodolistsAC(
        {todolists: [
            {id: "1", title: "1",  addedDate: '', order: 0, filter: "all", entityStatus: 'idle'},
            {id: "2", title: "2", addedDate: '', order: 0, filter: "all", entityStatus: 'idle'}
        ]}
    )

    const endState = tasksReducer({}, action)

    const  keys = Object.keys(endState)

    expect(keys.length).toBe(2)
    expect(endState["1"]).not.toBe([])
    expect(endState["2"]).not.toBe([])
})

test('correct task should be added to correct array', () => {
    const action = addTaskAC({
        todoListId: 'todoListId2',
        title: 'juice',
        status: TaskStatuses.New,
        addedDate: '',
        deadline: '',
        description: '',
        order: 0,
        priority: 0,
        startDate: '',
        id: '55'
    })

    const endState = tasksReducer(startState, action)
    expect(endState['todoListId2'].length).toBe(4);
    expect(endState['todoListId1'].length).toBe(3)
    expect(endState['todoListId2'][0].title).toBe('juice')
    expect(endState['todoListId2'][0].status).toBe(TaskStatuses.New)
})