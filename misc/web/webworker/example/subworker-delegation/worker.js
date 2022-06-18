const num_worker = 10
const items_per_worker = 10000

let result = 0
let pending_workers = num_worker

for (let i = 0; i < num_worker; i++) {
  const worker = new Worker('subworker.js')
  worker.postMessage({
    from: i * items_per_worker,
    to: (i + 1) * items_per_worker,
  })
  worker.onmessage = receiveSubworkerResult
}

function receiveSubworkerResult(e) {
  result += e.data
  pending_workers--
  if (pending_workers <= 0) {
    postMessage(result)
  }
}
