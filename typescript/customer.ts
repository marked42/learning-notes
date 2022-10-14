// type User = {
//   id: number
//   kind: string
// }

// function makeCustomer<T extends User>(u: T): T {
//   return {
//     // Below error, why?
//     ...u,
//     id: u.id,
//     kind: 'customer',
//   }
// }

// type Admin = User & {
//   kind: 'admin'
// }

// type IsAdminAUser = Admin extends User ? true : false // evaluates to true

// // 类型上不存在问题，预期admin中kind admin但是返回kind： customer
// const admin = makeCustomer({ id: 1, kind: 'admin' })
