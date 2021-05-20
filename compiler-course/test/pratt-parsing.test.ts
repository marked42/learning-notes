import { expression } from '../src/pratt-parsing'

describe('pratt parsing', () => {
  it.only('should parse binary operators', () => {
    const result = expression('1 + 2')
    console.log('result: ', result)
  })
})
