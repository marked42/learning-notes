import { ANTLRInputStream, CommonTokenStream } from 'antlr4ts'
import { CalculatorLexer } from './grammar/CalculatorLexer'
import { CalculatorParser } from './grammar/CalculatorParser'
import { EvaluationVisitor } from './EvaluationVisitor'

function startMathRepl(input: string) {
  const inputStream = new ANTLRInputStream(input)
  const lexer = new CalculatorLexer(inputStream)
  const tokenStream = new CommonTokenStream(lexer)
  const parser = new CalculatorParser(tokenStream)
  const visitor = new EvaluationVisitor()
  const tree = parser.prog()

  visitor.visit(tree)
}

startMathRepl(`
1 + 2 3
a = 1 + 2
b = 3
c = a+b
`)
