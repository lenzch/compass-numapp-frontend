import thunk from 'redux-thunk'
import { combineReducers, createStore, applyMiddleware } from 'redux'

// reducers
/*-----------------------------------------------------------------------------------*/

import LoginReducer from '../src/screens/login/loginReducer'
import AboutReducer from '../src/screens/about/aboutReducer'
import CheckInReducer from '../src/screens/checkIn/checkInReducer'

// services
/*-----------------------------------------------------------------------------------*/

import localStorage from '../src/services/localStorage/localStorage'

const appReducer = combineReducers({
	Login: LoginReducer,
	CheckIn: CheckInReducer,
	About: AboutReducer
})

const rootReducer = (state, action) => {

	// global actions that need to be available anywhere,
	// will be filtered out and executed by the rootReducer
	// (before the actual reducer is)

	if (action.type === 'USER_LOGOUT') {
		state = undefined
		localStorage.removeLastSubjectId()
	}

	if (action.type === 'DELETE_ALL_LOCAL_DATA') {
		localStorage.clearAll()
	}

	if (action.type === 'DELETE_LOCAL_QUESTIONNAIRE') {
		state.CheckIn.currentCategoryIndex = null
		state.CheckIn.questionnaireItemMap = null
		state.CheckIn.categories = null
		state.CheckIn.categoriesLoaded = false
		state.CheckIn.currentPageIndex = 1

		let subjectId = state.CheckIn.user.subjectId
		localStorage.removeLastQuestionnaireId(subjectId)
		localStorage.removeCategories(subjectId)
		localStorage.removeQuestionnaireItemMap(subjectId)
	}

	return appReducer(state, action)
}
 
export function buildStore(initialState) {
    
    const middlewares = [thunk]
    
    const store = createStore(
        rootReducer,
        initialState,
        applyMiddleware(...middlewares),
    )
    
    return store
}