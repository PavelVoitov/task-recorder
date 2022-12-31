

const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as ErrorType
}

export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case 'APP/SET-ERROR':
            return {...state, error: action.error}
        default:
            return state
    }
}

export const setAppErrorAC = (error: ErrorType) => ({type: 'APP/SET-ERROR', error} as const)
export const setAppStatusAC = (status: RequestStatusType) => ({type: 'APP/SET-STATUS', status} as const)


export type SetErrorType = ReturnType<typeof setAppErrorAC>
export type SetStatusType = ReturnType<typeof setAppStatusAC>
type ActionsType =  SetErrorType | SetStatusType
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type ErrorType = string | null
export type InitialStateType = typeof initialState


