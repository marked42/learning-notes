import { expression } from '../src/pratt-parsing'

describe('binary operators', () => {
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
      operator: '+',
      type: 'BinaryExpression',
    })
  })

  it('should parse binary operators with left associativity', () => {
    const result = expression('1 + 2 + 3')
    expect(result).toEqual({
      left: {
        type: 'BinaryExpression',
        operator: '+',
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
      operator: '+',
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
        operator: '^',
        left: {
          type: 'NumericLiteral',
          value: 2,
        },
        right: {
          type: 'NumericLiteral',
          value: 3,
        },
      },
      operator: '^',
      type: 'BinaryExpression',
    })
  })

  it('should parse binary operators with different precedence', () => {
    const result = expression('1 + 2 * 3')
    expect(result).toEqual({
      type: 'BinaryExpression',
      operator: '+',
      left: {
        type: 'NumericLiteral',
        value: 1,
      },
      right: {
        type: 'BinaryExpression',
        operator: '*',
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

describe('unary operators', () => {
  it('should parse prefix unary operator', () => {
    expect(expression('+ 1')).toEqual({
      type: 'UnaryExpression',
      operator: '+',
      value: {
        type: 'NumericLiteral',
        value: 1,
      },
    })

    expect(expression('- 1')).toEqual({
      type: 'UnaryExpression',
      operator: '-',
      value: {
        type: 'NumericLiteral',
        value: 1,
      },
    })
  })

  it('should throw for unsupported unary operator', () => {
    expect(() => expression('* 1')).toThrow()
  })

  it('should parse postfix unary operator', () => {
    expect(expression('1 !')).toEqual({
      type: 'UnaryExpression',
      operator: '!',
      value: {
        type: 'NumericLiteral',
        value: 1,
      },
    })
  })
})

describe('parenthesis', () => {
  it('should parse parenthesis expression', () => {
    expect(expression('(1)')).toEqual({
      type: 'NumericLiteral',
      value: 1,
    })

    expect(expression('(1 + 2)')).toEqual({
      type: 'BinaryExpression',
      operator: '+',
      left: {
        type: 'NumericLiteral',
        value: 1,
      },
      right: {
        type: 'NumericLiteral',
        value: 2,
      },
    })
  })
})

describe('index', () => {
  it('should parse index expression', () => {
    expect(expression('1[2]')).toEqual({
      type: 'MemberExpression',
      object: {
        type: 'NumericLiteral',
        value: 1,
      },
      property: {
        type: 'NumericLiteral',
        value: 2,
      },
    })
  })
})

describe('ternary expression', () => {
  it('should parse ternary expression', () => {
    expect(expression('1 ? 2 : 3')).toEqual({
      type: 'ConditionalExpression',
      test: {
        type: 'NumericLiteral',
        value: 1,
      },
      consequent: {
        type: 'NumericLiteral',
        value: 2,
      },
      alternate: {
        type: 'NumericLiteral',
        value: 3,
      },
    })

    const result = expression('1 ? 2 : 3 ? 4 : 5')
    expect(result).toEqual({
      type: 'ConditionalExpression',
      test: {
        type: 'NumericLiteral',
        value: 1,
      },
      consequent: {
        type: 'NumericLiteral',
        value: 2,
      },
      alternate: {
        type: 'ConditionalExpression',
        test: {
          type: 'NumericLiteral',
          value: 3,
        },
        consequent: {
          type: 'NumericLiteral',
          value: 4,
        },
        alternate: {
          type: 'NumericLiteral',
          value: 5,
        },
      },
    })
  })
})
