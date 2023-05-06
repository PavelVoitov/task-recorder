import * as authSelectors from './selectors'
import {Login} from './Login'
import * as authAsyncActions from "./auth-actions";
import {slice} from "./auth-reducer";


const authActions = {
	...authAsyncActions,
	...slice.actions
}

export {
	authSelectors,
	authActions,
	Login
}