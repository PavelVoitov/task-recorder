import thunk from 'redux-thunk'
import {configureStore} from "@reduxjs/toolkit"
import {rootReducer} from "app/reducer"
import createSagaMiddleware from 'redux-saga'

const sagaMiddleware = createSagaMiddleware()

export const store = configureStore({
	reducer: rootReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware()
			.prepend(thunk)
			.prepend(sagaMiddleware)
})

// @ts-ignore
window.store = store;

if (process.env.NODE_ENV !== 'development' && module.hot) {
	module.hot.accept('./app/reducer', () =>
	store.replaceReducer(rootReducer)
	)
}

