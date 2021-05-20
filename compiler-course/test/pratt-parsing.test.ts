import { expression } from '../src/pratt-parsing'

describe('pratt parsing', () => {
  it('should parse binary operators', () => {
    const result = expression('1 + 2')
    expect(result).toEqual({
      left: {
        type: 'NumericLiteral',
        value: 1,
      },
      right: {
        type: 'NumericLiteral',
        value: 2,
      },
      op: '+',
      type: 'BinaryExpression',
    })
  })

  it('should parse binary operators with left associativity', () => {
    const result = expression('1 + 2 + 3')
    expect(result).toEqual({
      left: {
        type: 'BinaryExpression',
        op: '+',
        left: {
          type: 'NumericLiteral',
          value: 1,
        },
        right: {
          type: 'NumericLiteral',
          value: 2,
        },
      },
      right: {
        type: 'NumericLiteral',
        value: 3,
      },
      op: '+',
      type: 'BinaryExpression',
    })
  })

  it('should parse binary operators with right associativity', () => {
    const result = expression('1 ^ 2 ^ 3')
    expect(result).toEqual({
      left: {
        type: 'NumericLiteral',
        value: 1,
      },
      right: {
        type: 'BinaryExpression',
        op: '^',
        left: {
          type: 'NumericLiteral',
          value: 2,
        },
        right: {
          type: 'NumericLiteral',
          value: 3,
        },
      },
      op: '^',
      type: 'BinaryExpression',
    })
  })

  it('should parse binary operators with different precedence', () => {
    const result = expression('1 + 2 * 3')
    expect(result).toEqual({
      type: 'BinaryExpression',
      op: '+',
      left: {
        type: 'NumericLiteral',
        value: 1,
      },
      right: {
        type: 'BinaryExpression',
        op: '*',
        left: {
          type: 'NumericLiteral',
          value: 2,
        },
        right: {
          type: 'NumericLiteral',
          value: 3,
        },
      },
    })
  })
})
