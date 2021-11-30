import moment from 'moment';



export const dateVal = (date = new Date(),fmate="DD/MM/YYYY") => { 
    return moment(date).format(fmate); 
  };
  export const  datesFromAndTo = (date=new Date(),fmate="D MMM YY")=>{
    let days = [];
    let daysRequired = 7
    
    for (let i = 0; i < daysRequired; i++) {
      days.push( moment(date).add(i, 'days').format(fmate) )
    }
    
    return days;
}