const obj = {
  one: 'uno',
  two: 'dos',
  three: 1,
}

// let k: keyof typeof obj
for (const k in obj) {
  const v = obj[k]
  // ~~~~~~ Element implicitly has an 'any' type
  // because type ... has no index signature
}

interface ABC {
  a: string
  b: string
  c: number
}

function foo(abc: ABC) {
  let k: keyof ABC
  for (k in abc) {
    // let k: "a" | "b" | "c"
    const v = abc[k] // Type is string | number
  }
}

function foo1(abc: ABC) {
  for (const [k, v] of Object.entries(abc)) {
    k // Type is string
    v // Type is any
  }
}

export {}
