import { ASTNode, ASTNodeType } from './ASTNode'
import { SimpleParser } from './SimpleParser'
import readline from 'readline'

export class Repl {
  private variables = new Map<string, number>()

  constructor() {}

  run() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })
    console.log(`> welcome to playground, press exit() to quit`)

    rl.on('line', (input) => {
      if (input === 'vars') {
        console.log('> all variables')
        console.log(
          Array.from(this.variables.keys()).map(
            (key) => `${key}: ${this.variables.get(key)}`
          )
        )
      } else {
        const parser = new SimpleParser()
        try {
          const astNode = parser.parse(input)
          console.log(`> ${this.evaluate(astNode)}`)
        } catch (e) {
          console.error(e)
        }
      }
    })
  }

  evaluate(astNode: ASTNode) {
    let result = 0

    switch (astNode.type) {
      case ASTNodeType.Program:
        const statements = astNode.children ?? []
        for (const s of statements) {
          result = this.evaluate(s)
        }
        break
      case ASTNodeType.IntDeclaration:
        {
          const [id, additive] = astNode?.children ?? []
          if (!id || !additive) {
            throw new Error('invalid int declaration')
          }
          const name = id.text
          const value = this.evaluate(additive)
          this.variables.set(name, value)
        }
        break
      case ASTNodeType.AssignmentStatement:
        {
          const [id, additive] = astNode?.children ?? []
          if (!id || !additive) {
            throw new Error('invalid assignment expression')
          }
          const name = id.text
          const value = this.evaluate(additive)
          if (!this.variables.has(name)) {
            throw new Error(`variable ${name} not declared`)
          }
          this.variables.set(name, value)
        }
        break
      case ASTNodeType.ExpressionStatement:
        {
          const additive = astNode?.children?.[0]
          if (!additive) {
            throw new Error('invalid expression statement, missing expression')
          }
          result = this.evaluate(additive)
        }
        break
      // case ASTNodeType.Primary:
      //   break
      case ASTNodeType.Multiplicative:
        {
          const [left, right] = astNode.children ?? []
          if (!left || !right) {
            throw new Error('invalid multiplicative node')
          }
          result = this.evaluate(left) * this.evaluate(right)
        }
        break
      case ASTNodeType.Additive:
        {
          const [left, right] = astNode.children ?? []
          if (!left || !right) {
            throw new Error('invalid additive node')
          }
          result = this.evaluate(left) + this.evaluate(right)
        }
        break
      case ASTNodeType.Identifier:
        const name = astNode.text
        const value = this.variables.get(name)
        if (value === undefined) {
          throw new Error(`variable ${name} not existed`)
        }
        result = value
        break
      case ASTNodeType.IntLiteral:
        const text = astNode.text ?? ''
        const number = Number.parseFloat(text)
        if (Number.isNaN(number)) {
          throw new Error('invalid int literal node')
        }
        result = number
        break
      default:
        throw new Error('invalid ast node type')
    }

    return result
  }
}

const repl = new Repl()
repl.run()
