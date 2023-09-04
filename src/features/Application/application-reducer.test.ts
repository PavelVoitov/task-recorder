import {initializeApp, InitialStateType, slice} from "features/Application/application-reducer";
import {appActions} from '../CommonActions/App'

const {reducer: appReducer} = slice
const {setAppError, setAppStatus} = appActions

let startState: InitialStateType

beforeEach(() => {
    startState = {
        error: null,
        status: 'idle',
        isInitialized: true
    }
})

test('correct error message should be set', () => {

    const endState = appReducer(startState, setAppError({error: 'Some error'}))

    expect(endState.error).toBe('Some error')
});

test('correct status should be set', () => {

    const endState = appReducer(startState, setAppStatus({status:'failed'}))

    expect(endState.status).toBe('failed')
})

test('App should be initialized with success resultCode', () => {
    const action = initializeApp.fulfilled(undefined, "")
    const endInitialState = appReducer(startState, action)

    expect(endInitialState.isInitialized).toBe(true)
})

test('App should be initialized with not success resultCode', () => {
    const action = initializeApp.rejected(new Error, "")
    const endInitialState = appReducer(startState, action)

    expect(endInitialState.isInitialized).toBe(true)
})



