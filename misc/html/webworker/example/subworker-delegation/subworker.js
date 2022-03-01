onmessage = (e) => {
  const { from, to } = e.data
  let result = 0
  for (let i = from; i < to; i++) {
    result += i
  }
  postMessage(result)
  close()
}
