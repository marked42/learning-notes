import { CalculatorVisitor } from './grammar/CalculatorVisitor'
import { AbstractParseTreeVisitor } from 'antlr4ts/tree/AbstractParseTreeVisitor'
import {
  ExprContext,
  MulDivExprContext,
  MinusExprContext,
  AddSubExprContext,
  NumberExprContext,
  ParenExprContext,
  PowerExprContext,
  VariableExprContext,
  ProgContext,
  StatContext,
  AssignmentContext,
} from './grammar/CalculatorParser'

export class EvaluationVisitor
  extends AbstractParseTreeVisitor<number>
  implements CalculatorVisitor<number> {
  variables = new Map()
  defaultResult() {
    return 0
  }

  visitProg(ctx: ProgContext) {
    this.visitChildren(ctx)
    return 0
  }

  visitStat(ctx: StatContext) {
    let ans = 0
    const child = ctx.getChild(0)
    if (child instanceof ExprContext) {
      ans = this.visitExpr(child)
    } else if (child instanceof AssignmentContext) {
      ans = this.visitAssignment(child)
    }
    console.log(ans)
    return ans
  }

  visitAssignment(ctx: AssignmentContext) {
    const name = ctx.ID().text
    const value = this.visitExpr(ctx.expr())

    this.variables.set(name, value)
    return value
  }

  visitBinaryExpr(ctx: AddSubExprContext): number {
    const left = this.visitExpr(ctx.expr(0))
    const right = this.visitExpr(ctx.expr(1))
    const op = ctx.getChild(1).text

    switch (op) {
      case '+':
        return left + right
      case '-':
        return left - right
      case '*':
        return left * right
      case '/':
        return left / right
      case '^':
        return Math.pow(left, right)
    }

    throw new Error('invalid binary expr')
  }

  visitMulDivExpr(ctx: MulDivExprContext) {
    return this.visitBinaryExpr(ctx)
  }

  visitAddSubExpr(ctx: AddSubExprContext) {
    return this.visitBinaryExpr(ctx)
  }

  visitPowerExpr(ctx: PowerExprContext) {
    return this.visitBinaryExpr(ctx)
  }

  visitMinusExpr(ctx: MinusExprContext): number {
    return -1 * this.visitExpr(ctx.expr())
  }

  visitParenExpr(ctx: ParenExprContext): number {
    return this.visitExpr(ctx.expr())
  }

  visitNumberExpr(ctx: NumberExprContext) {
    return Number.parseFloat(ctx.Number().text)
  }

  visitVariableExpr(ctx: VariableExprContext) {
    const name = ctx.ID().text
    if (!this.variables.has(name)) {
      throw new Error(`变量${name}不存在！`)
    }
    return this.variables.get(name)
  }

  visitExpr(ctx: ExprContext) {
    if (ctx instanceof MulDivExprContext) {
      return this.visitMulDivExpr(ctx)
    }
    if (ctx instanceof AddSubExprContext) {
      return this.visitAddSubExpr(ctx)
    }
    if (ctx instanceof PowerExprContext) {
      return this.visitPowerExpr(ctx)
    }
    if (ctx instanceof MinusExprContext) {
      return this.visitMinusExpr(ctx)
    }
    if (ctx instanceof ParenExprContext) {
      return this.visitParenExpr(ctx)
    }
    if (ctx instanceof NumberExprContext) {
      return this.visitNumberExpr(ctx)
    }
    if (ctx instanceof VariableExprContext) {
      return this.visitVariableExpr(ctx)
    }

    return 0
  }
}
