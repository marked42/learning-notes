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

describe('IntDeclaration', () => {
  it('should match IntDeclaration', () => {
    const code = 'int a = 1;'
    const parser = new SimpleParser()
    const lexer = new SimpleLexer()
    const tokenStream = lexer.tokenStream(code)
    const node = parser.matchIntDeclaration(tokenStream)

    expect(node).toEqual(
      new SimpleASTNode(
        ASTNodeType.IntDeclaration,
        null,
        [
          new SimpleASTNode(ASTNodeType.Identifier, null, null, 'a'),
          new SimpleASTNode(ASTNodeType.IntLiteral, null, null, '1'),
        ],
        ''
      )
    )
  })

  it('should match IntDeclaration', () => {
    const code = 'int a = 1 + 2;'
    const parser = new SimpleParser()
    const lexer = new SimpleLexer()
    const tokenStream = lexer.tokenStream(code)
    const node = parser.matchIntDeclaration(tokenStream)

    expect(node).toEqual(
      new SimpleASTNode(
        ASTNodeType.IntDeclaration,
        null,
        [
          new SimpleASTNode(ASTNodeType.Identifier, null, null, 'a'),
          new SimpleASTNode(
            ASTNodeType.Additive,
            null,
            [
              new SimpleASTNode(ASTNodeType.IntLiteral, null, null, '1'),
              new SimpleASTNode(ASTNodeType.IntLiteral, null, null, '2'),
            ],
            ''
          ),
        ],
        ''
      )
    )
  })

  it('should match IntDeclaration', () => {
    const code = 'int a = 1 * 2 + 3 * 4;'
    const parser = new SimpleParser()
    const lexer = new SimpleLexer()
    const tokenStream = lexer.tokenStream(code)
    const node = parser.matchIntDeclaration(tokenStream)

    expect(node).toEqual(
      new SimpleASTNode(
        ASTNodeType.IntDeclaration,
        null,
        [
          new SimpleASTNode(ASTNodeType.Identifier, null, null, 'a'),
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
                ASTNodeType.Multiplicative,
                null,
                [
                  new SimpleASTNode(ASTNodeType.IntLiteral, null, null, '3'),
                  new SimpleASTNode(ASTNodeType.IntLiteral, null, null, '4'),
                ],
                ''
              ),
            ],
            ''
          ),
        ],
        ''
      )
    )
  })
})

describe('assignment expression', () => {
  it('should match', () => {
    const code = 'a = 1;'
    const parser = new SimpleParser()
    const lexer = new SimpleLexer()
    const tokenStream = lexer.tokenStream(code)
    const node = parser.matchAssignmentStatement(tokenStream)

    expect(node).toEqual(
      new SimpleASTNode(
        ASTNodeType.AssignmentStatement,
        null,
        [
          new SimpleASTNode(ASTNodeType.Identifier, null, null, 'a'),
          new SimpleASTNode(ASTNodeType.IntLiteral, null, null, '1'),
        ],
        ''
      )
    )
  })

  it('should match', () => {
    const code = ''
    const parser = new SimpleParser()
    const lexer = new SimpleLexer()
    const tokenStream = lexer.tokenStream(code)
    const node = parser.matchAssignmentStatement(tokenStream)

    expect(node).toEqual(null)
  })

  it('should match', () => {
    const code = 'a'
    const parser = new SimpleParser()
    const lexer = new SimpleLexer()
    const tokenStream = lexer.tokenStream(code)
    const node = parser.matchAssignmentStatement(tokenStream)

    expect(node).toEqual(null)
  })

  it('should match', () => {
    const code = 'a = '
    const parser = new SimpleParser()
    const lexer = new SimpleLexer()
    const tokenStream = lexer.tokenStream(code)

    expect(() => parser.matchAssignmentStatement(tokenStream)).toThrowError()
  })

  it('should match', () => {
    const code = 'a = 1'
    const parser = new SimpleParser()
    const lexer = new SimpleLexer()
    const tokenStream = lexer.tokenStream(code)

    expect(() => parser.matchAssignmentStatement(tokenStream)).toThrowError()
  })
})

describe('expression statement', () => {
  it('should match', () => {
    const code = 'a;'
    const parser = new SimpleParser()
    const lexer = new SimpleLexer()
    const tokenStream = lexer.tokenStream(code)
    const node = parser.matchExpressionStatement(tokenStream)

    expect(node).toEqual(
      new SimpleASTNode(
        ASTNodeType.ExpressionStatement,
        null,
        [new SimpleASTNode(ASTNodeType.Identifier, null, null, 'a')],
        ''
      )
    )
  })

  it('should match', () => {
    const code = 'a = '
    const parser = new SimpleParser()
    const lexer = new SimpleLexer()
    const tokenStream = lexer.tokenStream(code)
    const node = parser.matchExpressionStatement(tokenStream)

    expect(node).toEqual(null)
  })

  it('should match', () => {
    const code = ''
    const parser = new SimpleParser()
    const lexer = new SimpleLexer()
    const tokenStream = lexer.tokenStream(code)
    const node = parser.matchExpressionStatement(tokenStream)

    expect(node).toEqual(null)
  })
})

describe('parse', () => {
  it('should parse correctly', () => {
    const code = `
      int a = 1;
      1 + 2;
      a = 1;
    `

    const parser = new SimpleParser()
    const node = parser.parse(code)

    expect(node).toEqual(
      new SimpleASTNode(
        ASTNodeType.Program,
        null,
        [
          new SimpleASTNode(
            ASTNodeType.IntDeclaration,
            null,
            [
              new SimpleASTNode(ASTNodeType.Identifier, null, null, 'a'),
              new SimpleASTNode(ASTNodeType.IntLiteral, null, null, '1'),
            ],
            ''
          ),
          new SimpleASTNode(
            ASTNodeType.ExpressionStatement,
            null,
            [
              new SimpleASTNode(
                ASTNodeType.Additive,
                null,
                [
                  new SimpleASTNode(ASTNodeType.IntLiteral, null, null, '1'),
                  new SimpleASTNode(ASTNodeType.IntLiteral, null, null, '2'),
                ],
                ''
              ),
            ],
            ''
          ),
          new SimpleASTNode(
            ASTNodeType.AssignmentStatement,
            null,
            [
              new SimpleASTNode(ASTNodeType.Identifier, null, null, 'a'),
              new SimpleASTNode(ASTNodeType.IntLiteral, null, null, '1'),
            ],
            ''
          ),
        ],
        ''
      )
    )
  })
})
