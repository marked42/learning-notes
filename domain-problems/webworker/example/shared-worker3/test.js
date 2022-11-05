let count = 0
onconnect = function (e) {
  var port = e.ports[0]
  console.log('sharedworker e: ', e)

  count++
  port.postMessage('Hello world you are connection #' + count)

  for (let port of e.ports) {
    port.onmessage = (e) => {
      port.postMessage('pong')
    }
  }
}
