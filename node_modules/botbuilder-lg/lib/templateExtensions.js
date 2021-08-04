"use strict";
/* eslint-disable security/detect-object-injection */
/**
 * @module botbuilder-lg
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const uuid_1 = require("uuid");
const lp = require("./generated/LGTemplateParser");
const range_1 = require("./range");
const position_1 = require("./position");
/**
 * Extension methods for LG.
 */
class TemplateExtensions {
    /**
     * Trim expression. ${abc} => abc,  ${a == {}} => a == {}.
     * @param expression Input expression string.
     * @returns Pure expression string.
     */
    static trimExpression(expression) {
        let result = expression.trim();
        if (result.startsWith('$')) {
            result = result.substr(1);
        }
        result = result.trim();
        if (result.startsWith('{') && result.endsWith('}')) {
            result = result.substr(1, result.length - 2);
        }
        return result.trim();
    }
    /**
     * Normalize authored path to os path.
     * path is from authored content which doesn't know what OS it is running on.
     * This method treats / and \ both as seperators regardless of OS, for windows that means / -> \ and for linux/mac \ -> /.
     * This allows author to use ../foo.lg or ..\foo.lg as equivelents for importing.
     * @param ambiguousPath AuthoredPath.
     * @returns Path expressed as OS path.
     */
    static normalizePath(ambiguousPath) {
        if (process.platform === 'win32') {
            // map linux/mac sep -> windows
            return path.normalize(ambiguousPath.replace(/\//g, '\\'));
        }
        else {
            // map windows sep -> linux/mac
            return path.normalize(ambiguousPath.replace(/\\/g, '/'));
        }
    }
    /**
     * Get prefix error message from normal template sting context.
     * @param context Normal template sting context.
     * @returns Prefix error message.
     */
    static getPrefixErrorMessage(context) {
        let errorPrefix = '';
        if (context.parent && context.parent.parent && context.parent.parent.parent) {
            if (context.parent.parent.parent instanceof lp.IfConditionRuleContext) {
                const conditionContext = context.parent.parent.parent;
                let tempMsg = '';
                if (conditionContext.ifCondition() && conditionContext.ifCondition().expression().length > 0) {
                    tempMsg = conditionContext.ifCondition().expression(0).text;
                    errorPrefix = `Condition '` + tempMsg + `': `;
                }
            }
            else {
                if (context.parent.parent.parent instanceof lp.SwitchCaseRuleContext) {
                    const switchCaseContext = context.parent.parent.parent;
                    const state = switchCaseContext.switchCaseStat();
                    if (state && state.DEFAULT()) {
                        errorPrefix = `Case 'Default':`;
                    }
                    else if (state && state.SWITCH()) {
                        let tempMsg = '';
                        if (state.expression(0)) {
                            tempMsg = state.expression(0).text;
                        }
                        errorPrefix = `Switch '${tempMsg} ':`;
                    }
                    else if (state && state.CASE()) {
                        let tempMsg = '';
                        if (state.expression(0)) {
                            tempMsg = state.expression(0).text;
                        }
                        errorPrefix = `Case '${tempMsg}':`;
                    }
                }
            }
        }
        return errorPrefix;
    }
    /**
     * If a value is pure Expression.
     * @param ctx Key value structure value context.
     */
    static isPureExpression(ctx) {
        if (ctx.expressionInStructure() === undefined || ctx.expressionInStructure().length != 1) {
            return false;
        }
        return ctx.expressionInStructure(0).text.trim() === ctx.text.trim();
    }
    /**
     * Escape \ from text.
     * @param exp Input text.
     * @returns Escaped text.
     */
    static evalEscape(exp) {
        const validCharactersDict = {
            '\\r': '\r',
            '\\n': '\n',
            '\\t': '\t',
            '\\\\': '\\',
        };
        return exp.replace(/\\[^\r\n]?/g, (sub) => {
            if (sub in validCharactersDict) {
                return validCharactersDict[sub];
            }
            else if (sub === '\\$') {
                return sub.substr(1);
            }
            else if (sub === '\\`') {
                return sub.substr(1);
            }
            else {
                return sub;
            }
        });
    }
    /**
     * Generate new guid string.
     */
    static newGuid() {
        return uuid_1.v4();
    }
    /**
     * read line from text.
     * @param input Text content.
     */
    static readLine(input) {
        if (!input) {
            return [];
        }
        return input.replace(/\r\n/g, '\n').split('\n');
    }
    /**
     * Convert antlr parser into Range.
     * @param context Antlr parse context.
     * @param [lineOffset] Line offset.
     * @returns Range object.
     */
    static convertToRange(context, lineOffset) {
        if (!lineOffset) {
            lineOffset = 0;
        }
        if (!context) {
            return range_1.Range.DefaultRange;
        }
        const startPosition = new position_1.Position(lineOffset + context.start.line, context.start.charPositionInLine);
        const stopPosition = new position_1.Position(lineOffset + context.stop.line, context.stop.charPositionInLine + context.stop.text.length);
        return new range_1.Range(startPosition, stopPosition);
    }
}
exports.TemplateExtensions = TemplateExtensions;
//# sourceMappingURL=templateExtensions.js.map