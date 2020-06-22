namespace Tuple {
  declare function entries<T extends { [key: string]: any }, K extends keyof T>(o: T): [keyof T, T[K]][];

  let R = entries({
    a: 1,
    b: '2',
  })
  // let [a, b] = R[0]
  let a = [1, 2].map(a => a + 1)
}
