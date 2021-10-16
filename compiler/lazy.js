function naturals(n) {
  return [
    n,
    function lazy() {
      return naturals(n + 1)
    },
  ]
}

function head(values) {
  return values[0]
}

function tail(values) {
  const lazy = values[1]
  return lazy()
}

console.log(
  head(naturals(1)),
  head(tail(naturals(1))),
  head(tail(tail(naturals(1))))
)
