//import { useDispatch } from 'react-redux'
import axios from '../../utils/axios'
import { newTblArr } from '../../utils/utills'
import  {VaccineActionTypes} from '../constants/actionTypes'

export const loadingSpinner = (data) =>{
    return {
        type:VaccineActionTypes.LOADING_SPINNER,
        payload:data
    }
}
export  const getDashboardData = (data) =>{
    return {
        type:VaccineActionTypes.GET_DASHOBORD_DATA,
        payload:data

    }
}
export  const getStates = ()=>{
    return async ( dispatch)=>{
        const respons = await axios.get('/api/v2/admin/location/states'); 
        dispatch({
            type:VaccineActionTypes.GET_STATES,
            payload:respons.data
    
        })
    }
}
export const fetchSlotsByDistric = (distId,date)=>{
    return async (dispatch)=>{
        const  respons = await axios.get(`/api/v2/appointment/sessions/public/calendarByDistrict?district_id=${distId}&date=${date}`);
        const  dt = await newTblArr(respons.data,date);
        dispatch({
            type:VaccineActionTypes.FETCH_SLOTS_BY_DIST,
            payload:dt
    
        })
    }
}
export const fetchSlotsByPin = (pin,date)=>{
    return async (dispatch)=>{
        const  respons = await axios.get(`/api/v2/appointment/sessions/public/calendarByPin?pincode=${pin}&date=${date}`);
        const  dt = await newTblArr(respons.data,date);
        dispatch({
            type:VaccineActionTypes.FETCH_SLOTS_BY_PIN,
            payload:dt
    
        })
    }
}
export  const  getDistric = (stateId) =>{
    return async ( dispatch)=>{
        const respons = await axios.get(`/api/v2/admin/location/districts/${stateId}`); 
        dispatch({
            type:VaccineActionTypes.GET_DISTRICT,
            payload:respons.data 
    
        })
    }
}

