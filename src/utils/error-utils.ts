import {setAppErrorAC, SetAppErrorType, setAppStatusAC, SetAppStatusType} from "../app/app-reducer";
import {ResponseType} from "../api/todolists-api";
import {Dispatch} from "redux";


export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: Dispatch<SetAppErrorType | SetAppStatusType>) => {
    if (data.messages.length) {
        dispatch(setAppErrorAC(data.messages[0]))
    } else {
        dispatch(setAppErrorAC('Some error occurred'))
    }
    dispatch(setAppStatusAC('failed'))
}

export const handleServerNetworkError = (error: {message : string}, dispatch: Dispatch<SetAppErrorType | SetAppStatusType>) => {
    dispatch(setAppErrorAC(error.message ? error.message : 'Some error occurred'))
    dispatch(setAppStatusAC('failed'))
}
