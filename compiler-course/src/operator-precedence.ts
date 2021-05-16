/**
 *  E --> P {B P}
 *  P --> v | "(" E ")" | U P
 *  B --> "+" | "-" | "*" | "/" | "^"
 *  U --> "-"
 */
export function shuntingYardParse(input: string) {
  let pos = 0
  const operators: string[] = []
  const operands = []
  const isOperator = (char: string) => /(+|-|*|\/|\^)/.test(char)
  const isDigit = (char: string) => /\d/.test(char)

  const operatorPrecedence = {}

  function E() {
    P()

    while (pos < input.length) {
      const token = input[pos]

      if (isDigit(token)) {
        operands.push(Number(token))
      } else if (isOperator(token)) {
        const topOperator = operators[operators.length - 1]
      } else {
        throw new Error('unexpected token ' + token)
      }
    }
  }

  function P() {}
}

/**
 *  E --> T {( "+" | "-" ) T}
 *  T --> F {( "*" | "/" ) F}
 *  F --> P ["^" F]
 *  P --> v | "(" E ")" | "-" T
 * @param input
 */
export function classic(input: string) {}

export function precedenceClimbing(input: string) {}
