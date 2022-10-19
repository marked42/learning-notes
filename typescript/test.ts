// Here types should remain the same ❄
type Config = {
  name: boolean
  lastname: boolean
}
type User = {
  name?: string
  lastname?: string
}

type SelectUser<C, U, K extends keyof C = keyof C> = Pick<
  Required<U>,
  K extends keyof U ? (C[K] extends true ? K : never) : never
>

// Here declaration to be changed 🔥
declare function getUser<T extends Config>(config: T): SelectUser<T, User>

// test cases
const user = getUser({ name: true, lastname: false })
user.name // this field should be non-optional
user.lastname // this field should not be there and we should have compile error 🛑

const user2 = getUser({ name: true, lastname: true })
user2.name // this field should be non-optional
user2.lastname // this field should be non-optional

const user3 = getUser({ name: false, lastname: true })
user3.name // this field should not be there and we should have compile error 🛑
user3.lastname // this field should be non-optional

const user4 = getUser({ name: false, lastname: false })
user4 // user4 should be empty object {}
