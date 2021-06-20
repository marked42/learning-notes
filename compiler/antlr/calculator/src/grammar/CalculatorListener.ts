// Generated from ./src/grammar/Calculator.g4 by ANTLR 4.9.0-SNAPSHOT


import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener";

import { NumberExprContext } from "./CalculatorParser";
import { VariableExprContext } from "./CalculatorParser";
import { ParenExprContext } from "./CalculatorParser";
import { MinusExprContext } from "./CalculatorParser";
import { PowerExprContext } from "./CalculatorParser";
import { MulDivExprContext } from "./CalculatorParser";
import { AddSubExprContext } from "./CalculatorParser";
import { ProgContext } from "./CalculatorParser";
import { StatContext } from "./CalculatorParser";
import { AssignmentContext } from "./CalculatorParser";
import { ExprContext } from "./CalculatorParser";


/**
 * This interface defines a complete listener for a parse tree produced by
 * `CalculatorParser`.
 */
export interface CalculatorListener extends ParseTreeListener {
	/**
	 * Enter a parse tree produced by the `numberExpr`
	 * labeled alternative in `CalculatorParser.expr`.
	 * @param ctx the parse tree
	 */
	enterNumberExpr?: (ctx: NumberExprContext) => void;
	/**
	 * Exit a parse tree produced by the `numberExpr`
	 * labeled alternative in `CalculatorParser.expr`.
	 * @param ctx the parse tree
	 */
	exitNumberExpr?: (ctx: NumberExprContext) => void;

	/**
	 * Enter a parse tree produced by the `variableExpr`
	 * labeled alternative in `CalculatorParser.expr`.
	 * @param ctx the parse tree
	 */
	enterVariableExpr?: (ctx: VariableExprContext) => void;
	/**
	 * Exit a parse tree produced by the `variableExpr`
	 * labeled alternative in `CalculatorParser.expr`.
	 * @param ctx the parse tree
	 */
	exitVariableExpr?: (ctx: VariableExprContext) => void;

	/**
	 * Enter a parse tree produced by the `parenExpr`
	 * labeled alternative in `CalculatorParser.expr`.
	 * @param ctx the parse tree
	 */
	enterParenExpr?: (ctx: ParenExprContext) => void;
	/**
	 * Exit a parse tree produced by the `parenExpr`
	 * labeled alternative in `CalculatorParser.expr`.
	 * @param ctx the parse tree
	 */
	exitParenExpr?: (ctx: ParenExprContext) => void;

	/**
	 * Enter a parse tree produced by the `minusExpr`
	 * labeled alternative in `CalculatorParser.expr`.
	 * @param ctx the parse tree
	 */
	enterMinusExpr?: (ctx: MinusExprContext) => void;
	/**
	 * Exit a parse tree produced by the `minusExpr`
	 * labeled alternative in `CalculatorParser.expr`.
	 * @param ctx the parse tree
	 */
	exitMinusExpr?: (ctx: MinusExprContext) => void;

	/**
	 * Enter a parse tree produced by the `powerExpr`
	 * labeled alternative in `CalculatorParser.expr`.
	 * @param ctx the parse tree
	 */
	enterPowerExpr?: (ctx: PowerExprContext) => void;
	/**
	 * Exit a parse tree produced by the `powerExpr`
	 * labeled alternative in `CalculatorParser.expr`.
	 * @param ctx the parse tree
	 */
	exitPowerExpr?: (ctx: PowerExprContext) => void;

	/**
	 * Enter a parse tree produced by the `mulDivExpr`
	 * labeled alternative in `CalculatorParser.expr`.
	 * @param ctx the parse tree
	 */
	enterMulDivExpr?: (ctx: MulDivExprContext) => void;
	/**
	 * Exit a parse tree produced by the `mulDivExpr`
	 * labeled alternative in `CalculatorParser.expr`.
	 * @param ctx the parse tree
	 */
	exitMulDivExpr?: (ctx: MulDivExprContext) => void;

	/**
	 * Enter a parse tree produced by the `addSubExpr`
	 * labeled alternative in `CalculatorParser.expr`.
	 * @param ctx the parse tree
	 */
	enterAddSubExpr?: (ctx: AddSubExprContext) => void;
	/**
	 * Exit a parse tree produced by the `addSubExpr`
	 * labeled alternative in `CalculatorParser.expr`.
	 * @param ctx the parse tree
	 */
	exitAddSubExpr?: (ctx: AddSubExprContext) => void;

	/**
	 * Enter a parse tree produced by `CalculatorParser.prog`.
	 * @param ctx the parse tree
	 */
	enterProg?: (ctx: ProgContext) => void;
	/**
	 * Exit a parse tree produced by `CalculatorParser.prog`.
	 * @param ctx the parse tree
	 */
	exitProg?: (ctx: ProgContext) => void;

	/**
	 * Enter a parse tree produced by `CalculatorParser.stat`.
	 * @param ctx the parse tree
	 */
	enterStat?: (ctx: StatContext) => void;
	/**
	 * Exit a parse tree produced by `CalculatorParser.stat`.
	 * @param ctx the parse tree
	 */
	exitStat?: (ctx: StatContext) => void;

	/**
	 * Enter a parse tree produced by `CalculatorParser.assignment`.
	 * @param ctx the parse tree
	 */
	enterAssignment?: (ctx: AssignmentContext) => void;
	/**
	 * Exit a parse tree produced by `CalculatorParser.assignment`.
	 * @param ctx the parse tree
	 */
	exitAssignment?: (ctx: AssignmentContext) => void;

	/**
	 * Enter a parse tree produced by `CalculatorParser.expr`.
	 * @param ctx the parse tree
	 */
	enterExpr?: (ctx: ExprContext) => void;
	/**
	 * Exit a parse tree produced by `CalculatorParser.expr`.
	 * @param ctx the parse tree
	 */
	exitExpr?: (ctx: ExprContext) => void;
}

