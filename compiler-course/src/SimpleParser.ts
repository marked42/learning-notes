import { SimpleASTNode, ASTNodeType, ASTNode } from './ASTNode'
import { SimpleLexer } from './SimpleLexer'
import { TokenType } from './Token'
import { TokenStream } from './TokenStream'
//  * 一个简单的语法解析器。
//  * 能够解析简单的表达式、变量声明和初始化语句、赋值语句。
//  * 它支持的语法规则为：
//  *
//  * program -> intDeclare | expressionStatement | assignmentStatement
//  * intDeclare -> 'int' Id ( = additive) ';'
//  * expressionStatement -> additive ';'
//  * additive -> multiplicative ( (+ | -) multiplicative)*
//  * multiplicative -> primary ( (* | /) primary)*
//  * primary -> IntLiteral | Id | (additive)
//  * assignmentStatement -> Id '=' additive ';'

export class SimpleParser {
  constructor() {}

  parse(script: string) {
    const lexer = new SimpleLexer()
    const tokenStream = lexer.tokenStream(script)
    return this.program(tokenStream)
  }

  program(tokens: TokenStream) {
    const children: ASTNode[] = []

    let node
    while (tokens.peek()) {
      node = this.matchIntDeclaration(tokens)
      if (!node) {
        node = this.matchExpressionStatement(tokens)
      }
      if (!node) {
        node = this.matchAssignmentStatement(tokens)
      }

      if (node) {
        children.push(node)
      } else {
        throw new Error('unknown statement' + tokens.peek())
      }
    }

    return new SimpleASTNode(ASTNodeType.Program, null, children, '')
  }

  matchIntDeclaration(tokens: TokenStream) {
    let token = tokens.peek()

    if (!token || token?.type !== TokenType.Keyword || token?.text === 'Int') {
      return null
    }
    tokens.read()
    token = tokens.peek()

    if (!token || token.type !== TokenType.Identifier) {
      throw new Error(
        'failed to match IntDeclaration, expecting identifier after "int"'
      )
    }

    const children = [
      new SimpleASTNode(ASTNodeType.Identifier, null, null, token.text),
    ]
    tokens.read()
    token = tokens.peek()

    if (!token || token.type !== TokenType.Operator || token.text !== '=') {
      throw new Error(
        'failed to match IntDeclaration, expecting = after identifier'
      )
    }
    tokens.read()

    const value = this.matchAdditiveExpression(tokens)

    if (!value) {
      throw new Error(
        'failed to match IntDeclaration, expecting additive expression after ='
      )
    }

    children.push(value)

    token = tokens.peek()
    if (!token || token.type !== TokenType.SemiColon) {
      throw new Error('failed to match IntDeclaration, missing ;')
    }
    tokens.read()

    return new SimpleASTNode(ASTNodeType.IntDeclaration, null, children, '')
  }

  matchExpressionStatement(tokens: TokenStream) {
    let pos = tokens.getPosition()

    const additive = this.matchAdditiveExpression(tokens)
    if (!additive) {
      return null
    }

    let token = tokens.peek()
    if (!token || token.type !== TokenType.SemiColon) {
      tokens.setPosition(pos)
      return null
    }
    tokens.read()

    return new SimpleASTNode(
      ASTNodeType.ExpressionStatement,
      null,
      [additive],
      ''
    )
  }

  matchAssignmentStatement(tokens: TokenStream) {
    let token = tokens.peek()
    if (!token || token.type !== TokenType.Identifier) {
      return null
    }
    const identifierName = token.text
    tokens.read()

    token = tokens.peek()
    if (!token || token.type !== TokenType.Operator || token.text !== '=') {
      tokens.unread()
      return null
    }
    tokens.read()

    const additive = this.matchAdditiveExpression(tokens)
    if (!additive) {
      throw new Error(
        'failed to match assignment expression, expecting an expression'
      )
    }

    token = tokens.peek()
    if (!token || token.type !== TokenType.SemiColon) {
      throw new Error('failed to match assignment expression, expecting ;')
    }
    tokens.read()

    return new SimpleASTNode(
      ASTNodeType.AssignmentStatement,
      null,
      [
        new SimpleASTNode(ASTNodeType.Identifier, null, null, identifierName),
        additive,
      ],
      ''
    )
  }

  matchAdditiveExpression(tokens: TokenStream): ASTNode | null {
    const node = this.matchMultiplicativeExpression(tokens)
    if (!node) {
      return null
    }

    let nextToken
    let resultNode

    while (true) {
      nextToken = tokens.peek()
      if (
        !nextToken ||
        nextToken?.type !== TokenType.Operator ||
        !['+', '-'].includes(nextToken?.text)
      ) {
        break
      }

      tokens.read()

      const right = this.matchMultiplicativeExpression(tokens)
      if (!right) {
        throw new Error('expecting to match additive expression')
      }

      if (!resultNode) {
        resultNode = new SimpleASTNode(
          ASTNodeType.Additive,
          null,
          [node, right],
          ''
        )
      } else {
        resultNode = new SimpleASTNode(
          ASTNodeType.Additive,
          null,
          [resultNode, right],
          ''
        )
      }
    }

    return resultNode || node
  }

  matchMultiplicativeExpression(tokens: TokenStream): ASTNode | null {
    const node = this.matchPrimaryExpression(tokens)

    if (!node) {
      return null
    }

    let nextToken
    let resultNode
    while (true) {
      nextToken = tokens.peek()
      if (
        !nextToken ||
        nextToken?.type !== TokenType.Operator ||
        !['*', '/'].includes(nextToken?.text)
      ) {
        break
      }
      tokens.read()

      const primaryNode = this.matchPrimaryExpression(tokens)
      if (!primaryNode) {
        throw new Error('failed to match multiplicative expression')
      }

      if (!resultNode) {
        resultNode = new SimpleASTNode(
          ASTNodeType.Multiplicative,
          null,
          [node, primaryNode],
          ''
        )
      } else {
        resultNode = new SimpleASTNode(
          ASTNodeType.Multiplicative,
          null,
          [resultNode, primaryNode],
          ''
        )
      }
    }

    return resultNode || node
  }

  matchPrimaryExpression(tokens: TokenStream): ASTNode | null {
    const token = tokens.read()

    if (token?.type === TokenType.IntLiteral) {
      return new SimpleASTNode(ASTNodeType.IntLiteral, null, null, token.text)
    }

    if (token?.type === TokenType.Identifier) {
      return new SimpleASTNode(ASTNodeType.Identifier, null, null, token.text)
    }

    if (token?.type === TokenType.Paren && token?.text === '(') {
      const node = this.matchAdditiveExpression(tokens)

      if (!node) {
        throw new Error('expect additive expression inside parenthesis')
      }

      const nextToken = tokens.peek()
      if (nextToken?.type === TokenType.Paren && nextToken?.text === ')') {
        return node
      } else {
        throw new Error('expect right parenthesis')
      }
    }

    return null
  }
}
