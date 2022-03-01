const path = require('path')
const net = require('net')
const server = net.createServer()

server
  .on('connection', function (s) {
    s.end('handled by parent')
    s.close()
  })
  .listen(1377)

const { fork } = require('child_process')
const child = fork(path.resolve(__dirname, './child.js'))
child.send('server', server)
