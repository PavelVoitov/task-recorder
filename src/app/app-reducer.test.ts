import {appReducer, ErrorType, RequestStatusType, setAppErrorAC, setAppStatusAC} from "./app-reducer";

type InitialStateType = {
    error: ErrorType,
    status: RequestStatusType,
    isInitialized: boolean
}

let startState: InitialStateType

beforeEach(() => {

    startState = {
        error: null,
        status: 'idle',
        isInitialized: true
    }
})

test('correct error message should be set', () => {

    const endState = appReducer(startState, setAppErrorAC({error: 'Some error'}))

    expect(endState.error).toBe('Some error')
});

test('correct status should be set', () => {

    const endState = appReducer(startState, setAppStatusAC({status:'failed'}))

    expect(endState.status).toBe('failed')
});

