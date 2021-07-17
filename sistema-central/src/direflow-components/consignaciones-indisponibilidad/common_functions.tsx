export const to_yyyy_mm_dd = (date) => {
  return (
    date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
  );
};

export const to_dd_mm_yyyy = (date) => {
  return (
    date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear()
  );
};

export const to_yyyy_mm_dd_hh_mm_ss = (date: Date) => {
  return (
    date.getFullYear() +
    "-" +
    (date.getMonth() + 1) +
    "-" +
    date.getDate() +
    " " +
    date.getHours() +
    ":" +
    date.getMinutes() +
    ":" +
    date.getSeconds()
  );
};

export const to_dd_month_yyyy_hh_mm = (date: Date) => {
  let month = getMonth(date.getMonth() + 1);
  return (
    date.getDate()  +
    "-" +
    month.substring(0, 4) +
    "-" +
    date.getFullYear()
     +
    " " +
    date.getHours() +
    ":" +
    date.getMinutes() +
    ":" +
    date.getSeconds()
  );
};


var getMonth = function (idx) {
  var objDate = new Date();
  objDate.setDate(1);
  objDate.setMonth(idx - 1);

  var locale = "es-us",
    month = objDate.toLocaleString(locale, { month: "long" });

  return month;
};

export const get_last_month_dates = () => {
  let now = new Date();
  let first_day_month = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  let last_day_month = new Date(now.getFullYear(), now.getMonth(), 0);
  return { first_day_month: first_day_month, last_day_month: last_day_month };
};
