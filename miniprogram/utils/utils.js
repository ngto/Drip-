export const formatTime = (date) => {
  if (!date) {
    date = new Date();
  }
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate();
  if (month < 10) {
    month = "0" + month;
  }
  if (day < 10) {
    day = "0" + day;
  }
  return year + "-" + month + "-" + day;
}
export const formatMonth = (date) => {
  if (!date) {
    date = new Date();
  }
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate();
  if (month < 10) {
    month = "0" + month;
  }
  return year + "-" + month;
}
export const getFormatDay = (date) => {
  if (!date) {
    date = new Date();
  } else {
    date = new Date(date);
  }
  var day = date.getDate();
  if (day < 10) {
    day = "0" + day;
  }
  return day;
}

export const getMonthLength = (date) => {
  let d = new Date(date)
  // 将日期设置为下月一号
  d.setMonth(d.getMonth() + 1)
  d.setDate('1')
  // 获取本月最后一天
  d.setDate(d.getDate() - 1)
  return d.getDate()
}