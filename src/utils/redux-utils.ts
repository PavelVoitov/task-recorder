import {ActionCreatorsMapObject, bindActionCreators} from "redux";
import {useMemo} from "react";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {AppDispatchType, AppRootStateType} from "utils/types";

export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector
export const AppDispatch = () => useDispatch<AppDispatchType>()

export const useActions = <T extends ActionCreatorsMapObject<any>>(actions: T) => {
	const dispatch = AppDispatch()
	return useMemo(() => {
		return bindActionCreators(actions, dispatch)
	}, [])
}