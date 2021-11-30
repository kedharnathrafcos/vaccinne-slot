import { datesFromAndTo } from "./dateConversions";
import moment from 'moment';

export const  newTblArr = async (data,date) => {

    const datesForTbl= await datesFromAndTo(moment(date, 'DD-MM-YYYY').format(),"DD-MM-YYYY");//['23-11-2021', '24-11-2021', '25-11-2021', '26-11-2021', '27-11-2021', '28-11-2021', '29-11-2021']
    //console.log("data",data.centers.length)
    let newArr ;
    let  retunObj = {apiData:data,filterData:{}}
    let  reqObj =   await data.centers.filter(  (ele)=>{
      //console.log("ele.sessions.length",ele.sessions.length)
      return ele.sessions.length>0
    });
   if(reqObj.length){ 
         newArr=reqObj.map((item1)=>{
          
        const vaccines = item1.sessions.map(v=>v.vaccine);
        //console.log("vaccines",vaccines)
      const ourSessionsObj={};
      datesForTbl.forEach((date)=>{
          const  mmObj = item1.sessions.map((item3)=>({...item3,orderVaccine:vaccines[item3.vaccine],fee_type:item1.fee_type})).filter(item2=>(item2.date===date)).sort((a,b)=>((a.orderVaccine)-(b.orderVaccine)))
          //console.log(mmObj);
         // const filters = item1.sessions.map((item3)=>({min_age_limit:item3.min_age_limit}))  
        ourSessionsObj[date]=mmObj; 

      })
      return {
        ...item1,
        //filters:filters,
        our_sessions:ourSessionsObj
      };
    }) }
    else {
        newArr =[];
    } 
    retunObj.filterData={centers:newArr}
    return retunObj
  } 

   