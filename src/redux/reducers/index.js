import {  combineReducers} from "redux";
import  {vaccineReducer} from './vaccineReducer';


const reducers  = combineReducers({
    vaccineDetails:vaccineReducer
})

export default reducers;