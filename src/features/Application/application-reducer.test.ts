import {InitialStateType, slice} from "features/Application/application-reducer";
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
});

