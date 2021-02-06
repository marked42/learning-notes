let n = 2
while (true) {
  let isPrime = true
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) {
      isPrime = false
      break
    }
  }
  if (isPrime) {
    self.postMessage(n)
  }
  n++
}
