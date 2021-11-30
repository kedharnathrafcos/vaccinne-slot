import { VaccineActionTypes } from "../constants/actionTypes";

 
export const vaccineReducer = (state={loadingSpinner:true},{type,payload})=>{
    switch(type){
        case VaccineActionTypes.GET_DASHOBORD_DATA:
            return state;
        case VaccineActionTypes.GET_STATES:
            return {...state,statesObj:payload,loadingSpinner:false};
        case VaccineActionTypes.LOADING_SPINNER :
            return {...state,loadingSpinner:payload}  
        case VaccineActionTypes.GET_DISTRICT:
            return {...state,districObj:payload,loadingSpinner:false} 
        case VaccineActionTypes.FETCH_SLOTS_BY_DIST:
            return {...state,resultByDistric:payload.filterData,apiData:payload.apiData,loadingSpinner:false} 
        case VaccineActionTypes.FETCH_SLOTS_BY_PIN:
            return {...state,resultByDistric:payload.filterData,apiData:payload.apiData,loadingSpinner:false} 
             default :
            return state;
    }

}