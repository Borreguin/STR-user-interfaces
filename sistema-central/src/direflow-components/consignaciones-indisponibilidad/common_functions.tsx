export const to_yyyy_mm_dd = (date) => { 
    return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
  }
  
  export const to_dd_mm_yyyy = (date) => { 
    return date.getDate() +  "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
  }
  
  
  export const to_yyyy_mm_dd_hh_mm_ss = (date:Date) => { 
    return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +
      date.getHours() + ":" + date.getMinutes() + ":"  + date.getSeconds();
  }
  
  export const get_last_month_dates = () => { 
    let now = new Date();
    let first_day_month = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1
    );
    let last_day_month = new Date(
      now.getFullYear(),
      now.getMonth(),
      0
    );
    return {first_day_month:first_day_month, last_day_month:last_day_month}
  
  }