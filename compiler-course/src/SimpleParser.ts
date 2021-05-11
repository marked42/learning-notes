import { SimpleASTNode, ASTNodeType } from './ASTNode'
import { SimpleLexer } from './SimpleLexer'
import { Token, TokenType } from './Token'
import { TokenStream } from './TokenStream'
//  * 一个简单的语法解析器。
//  * 能够解析简单的表达式、变量声明和初始化语句、赋值语句。
//  * 它支持的语法规则为：
//  *
//  * programm -> intDeclare | expressionStatement | assignmentStatement
//  * intDeclare -> 'int' Id ( = additive) ';'
//  * expressionStatement -> addtive ';'
//  * addtive -> multiplicative ( (+ | -) multiplicative)*
//  * multiplicative -> primary ( (* | /) primary)*
//  * primary -> IntLiteral | Id | (additive)

export class SimpleParser {
  constructor() {}

  parse(script: string) {
    const lexer = new SimpleLexer()
    const tokenStream = lexer.tokenize(script)
  }

  matchIntDeclaration() {}

  matchExpressionStatement() {}

  matchAssignmentStatement() {}

  matchExpression() {}

  matchAdditiveExpression(tokens: TokenStream) {
    return null
  }

  matchMultiplicativeExpression(tokens: TokenStream) {
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

  matchPrimaryExpression(tokens: TokenStream) {
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
