// self.onconnect = (e) => {
//   e.ports[0].postMessage('hello world')
// }

onconnect = function (e) {
  var port = e.ports[0]
  port.postMessage('Hello World!')

  port.onmessage = (e) => {
    port.postMessage('pong')
  }
}
