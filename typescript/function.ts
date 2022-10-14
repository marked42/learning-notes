function testThrow() {
  throw new Error('un')

  console.log('unreachable code')
}

function testThrowWrapper() {
  function panic() {
    throw 1
  }

  return panic()

  console.log('unreachable code')
}
