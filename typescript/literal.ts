const stringLiteral: 'https' = 'https' // Type "https" (non-widening)
const numericLiteral: 42 = 42 // Type 42 (non-widening)

let widenedStringLiteral = stringLiteral // Type "https" (non-widening)
let widenedNumericLiteral = numericLiteral // Type 42 (non-widening)
