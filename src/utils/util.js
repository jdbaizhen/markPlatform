const dataFarmat = (obj) => {
  let result = ''
  for(let item in obj ){
    result += encodeURIComponent(item) + '=' + encodeURIComponent(obj[item]) + '&'
  }
  return result
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const timeFormat = (date) => {
  let year = date.getFullYear()
  let month = date.getMonth()+1
  let day = date.getDate()
  let hour = date.getHours()
  let minute = date.getMinutes()
  let second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

module.exports = {
  dataFarmat: dataFarmat,
  timeFormat: timeFormat
}