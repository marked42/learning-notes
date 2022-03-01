const { spawn } = require('child_process')
const ls = spawn('vue', ['-h'])

console.log('path: ', process.execPath)

// ls.stdout.on('data', (data) => {
//   console.log(`stdout: ${data}`)
// })

// ls.stderr.on('data', (data) => {
//   console.error(`stderr: ${data}`)
// })

ls.on('close', (code) => {
  console.log(`子进程退出，退出码 ${code}`)
})
