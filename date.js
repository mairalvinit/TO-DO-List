
exports.getDate=function (){
let today = new Date();
let options = {
  weekday: "long",
  day: "numeric",
  month: "long"
}

let date = today.toLocaleDateString("en-US", options);
return date;
}

exports.getDay = function (){
let today = new Date();
let options = {
  weekday: "long",
}
 return today.toLocaleDateString("en-US", options);
}
//console.log(exports);
