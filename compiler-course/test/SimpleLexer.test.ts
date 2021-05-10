import { SimpleLexer } from '../src/SimpleLexer'
import { TokenType, SimpleToken } from '../src/Token'

describe('SimpleLexer', () => {
  it('should parse ', () => {
    const lexer = new SimpleLexer()
    const tokens = lexer.tokenize('int age =  45;')
    expect(tokens).toEqual([
      new SimpleToken(TokenType.Keyword, 'int'),
      new SimpleToken(TokenType.Identifier, 'age'),
      new SimpleToken(TokenType.Operator, '='),
      new SimpleToken(TokenType.IntLiteral, '45'),
    ])
  })

  it('should parse inta', () => {
    const lexer = new SimpleLexer()
    expect(lexer.tokenize('inta age = 45;')).toEqual([
      new SimpleToken(TokenType.Identifier, 'inta'),
      new SimpleToken(TokenType.Identifier, 'age'),
      new SimpleToken(TokenType.Operator, '='),
      new SimpleToken(TokenType.IntLiteral, '45'),
    ])
  })

  it('should parse', () => {
    const lexer = new SimpleLexer()
    expect(lexer.tokenize('in age = 45;')).toEqual([
      new SimpleToken(TokenType.Identifier, 'in'),
      new SimpleToken(TokenType.Identifier, 'age'),
      new SimpleToken(TokenType.Operator, '='),
      new SimpleToken(TokenType.IntLiteral, '45'),
    ])
  })

  it('should parse', () => {
    const lexer = new SimpleLexer()
    expect(lexer.tokenize('age >= 45;')).toEqual([
      new SimpleToken(TokenType.Identifier, 'age'),
      new SimpleToken(TokenType.Operator, '>='),
      new SimpleToken(TokenType.IntLiteral, '45'),
    ])
  })

  it('should parse', () => {
    const lexer = new SimpleLexer()
    expect(lexer.tokenize('age > 45;')).toEqual([
      new SimpleToken(TokenType.Identifier, 'age'),
      new SimpleToken(TokenType.Operator, '>'),
      new SimpleToken(TokenType.IntLiteral, '45'),
    ])
  })
})
