import { SimpleParser } from '../src/SimpleParser'
import { SimpleLexer } from '../src/SimpleLexer'
import { ASTNodeType, SimpleASTNode } from '../src/ASTNode'

describe('SimpleParser', () => {
  it('should parse primary expression', () => {
    const code = 'a'
    const parser = new SimpleParser()
    const lexer = new SimpleLexer()
    const tokenStream = lexer.tokenStream(code)
    const node = parser.matchPrimaryExpression(tokenStream)
    expect(node).toEqual(
      new SimpleASTNode(ASTNodeType.Identifier, null, null, 'a')
    )
  })

  it('should parse primary expression', () => {
    const code = '223'
    const parser = new SimpleParser()
    const lexer = new SimpleLexer()
    const tokenStream = lexer.tokenStream(code)
    const node = parser.matchPrimaryExpression(tokenStream)
    expect(node).toEqual(
      new SimpleASTNode(ASTNodeType.IntLiteral, null, null, '223')
    )
  })
})

describe('multiplicative expression', () => {
  it('should parse multiplicative expression', () => {
    const code = '1 * 2 * 3'
    const parser = new SimpleParser()
    const lexer = new SimpleLexer()
    const tokenStream = lexer.tokenStream(code)
    const node = parser.matchMultiplicativeExpression(tokenStream)
    expect(node).toEqual(
      new SimpleASTNode(
        ASTNodeType.Multiplicative,
        null,
        [
          new SimpleASTNode(
            ASTNodeType.Multiplicative,
            null,
            [
              new SimpleASTNode(ASTNodeType.IntLiteral, null, null, '1'),
              new SimpleASTNode(ASTNodeType.IntLiteral, null, null, '2'),
            ],
            ''
          ),
          new SimpleASTNode(ASTNodeType.IntLiteral, null, null, '3'),
        ],
        ''
      )
    )
  })

  it('should parse single primary expression', () => {
    const code = '1'
    const parser = new SimpleParser()
    const lexer = new SimpleLexer()
    const tokenStream = lexer.tokenStream(code)
    const node = parser.matchMultiplicativeExpression(tokenStream)

    expect(node).toEqual(
      new SimpleASTNode(ASTNodeType.IntLiteral, null, null, '1')
    )
  })

  it('should throw', () => {
    const code = '1 * '
    const parser = new SimpleParser()
    const lexer = new SimpleLexer()
    const tokenStream = lexer.tokenStream(code)

    expect(() =>
      parser.matchMultiplicativeExpression(tokenStream)
    ).toThrowError()
  })
})

describe('additive', () => {
  it('should parse correctly', () => {
    const code = '1 + 2 '
    const parser = new SimpleParser()
    const lexer = new SimpleLexer()
    const tokenStream = lexer.tokenStream(code)
    const node = parser.matchAdditiveExpression(tokenStream)

    expect(node).toEqual(
      new SimpleASTNode(
        ASTNodeType.Additive,
        null,
        [
          new SimpleASTNode(ASTNodeType.IntLiteral, null, null, '1'),
          new SimpleASTNode(ASTNodeType.IntLiteral, null, null, '2'),
        ],
        ''
      )
    )
  })

  it('should parse correctly', () => {
    const code = '1 * 2 + 3 '
    const parser = new SimpleParser()
    const lexer = new SimpleLexer()
    const tokenStream = lexer.tokenStream(code)
    const node = parser.matchAdditiveExpression(tokenStream)

    expect(node).toEqual(
      new SimpleASTNode(
        ASTNodeType.Additive,
        null,
        [
          new SimpleASTNode(
            ASTNodeType.Multiplicative,
            null,
            [
              new SimpleASTNode(ASTNodeType.IntLiteral, null, null, '1'),
              new SimpleASTNode(ASTNodeType.IntLiteral, null, null, '2'),
            ],
            ''
          ),
          new SimpleASTNode(ASTNodeType.IntLiteral, null, null, '3'),
        ],
        ''
      )
    )
  })

  it('should parse correctly', () => {
    const code = '1 * 2 + (3 + 4) '
    const parser = new SimpleParser()
    const lexer = new SimpleLexer()
    const tokenStream = lexer.tokenStream(code)
    const node = parser.matchAdditiveExpression(tokenStream)

    expect(node).toEqual(
      new SimpleASTNode(
        ASTNodeType.Additive,
        null,
        [
          new SimpleASTNode(
            ASTNodeType.Multiplicative,
            null,
            [
              new SimpleASTNode(ASTNodeType.IntLiteral, null, null, '1'),
              new SimpleASTNode(ASTNodeType.IntLiteral, null, null, '2'),
            ],
            ''
          ),
          new SimpleASTNode(
            ASTNodeType.Additive,
            null,
            [
              new SimpleASTNode(ASTNodeType.IntLiteral, null, null, '3'),
              new SimpleASTNode(ASTNodeType.IntLiteral, null, null, '4'),
            ],
            ''
          ),
        ],
        ''
      )
    )
  })
})