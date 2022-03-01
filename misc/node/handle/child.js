process.on('message', function (msg, server) {
  if (msg === 'server') {
    server.on('connection', function (s) {
      s.end('handled by child\n')
      s.close()
    })
  }
})
