import thunk from 'redux-thunk'
import {configureStore} from "@reduxjs/toolkit";
import {rootReducer} from "app/reducer";

export const store = configureStore({
	reducer: rootReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware()
			.prepend(thunk)
})

// @ts-ignore
window.store = store;

if (process.env.NODE_ENV !== 'development' && module.hot) {
	module.hot.accept('./app/reducer', () =>
	store.replaceReducer(rootReducer)
	)
}

