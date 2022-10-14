function shallowObjectEqual<T extends object>(a: T, b: T): boolean {
  for (const [key, val] of Object.entries(a)) {
    if (!(key in a) || val !== b[key]) {
      return false
    }
  }

  return Object.keys(a).length === Object.keys(b).length
}
