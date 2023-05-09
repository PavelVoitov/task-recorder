import * as appSelectors from 'app/selectors'
import {RequestStatusType as RequestStatus, slice} from 'features/Application/application-reducer'
import {asyncActions} from './application-reducer'

const appReducer = slice.reducer
const actions = slice.actions

const appActions = {
	...actions,
	...asyncActions

}

export type RequestStatusType = RequestStatus

export {
	appSelectors,
	appReducer,
	appActions
}


