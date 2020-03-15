// setTimeout(function(){
//   console.log("Timeout ");
// }, 1000);
// setInterval(function(){
//   console.log("Interval ");
// }, 500);

const timeoutId = setTimeout(function(){
  console.log("Timeout ");
}, 1000);
setInterval(function(){
  console.log("Interval ");
}, 500);

setTimeout(() => {
  clearTimeout(timeoutId);
}, 2000)
