"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const diagnostic_1 = require("./diagnostic");
const templateException_1 = require("./templateException");
const position_1 = require("./position");
const range_1 = require("./range");
const templateErrors_1 = require("./templateErrors");
/**
 * LG parser error listener.
 */
class ErrorListener {
    /**
     * Creates a new instance of the [ErrorListener](xref:botbuilder-lg.ErrorListener) class.
     * @param errorSource String value that represents the source of the error.
     * @param lineOffset Offset of the line where the error occurred.
     */
    constructor(errorSource, lineOffset) {
        this.source = errorSource;
        if (lineOffset === undefined) {
            lineOffset = 0;
        }
        this.lineOffset = lineOffset;
    }
    /**
     * Notifies any interested parties upon a syntax error.
     * @param recognizer What parser got the error. From this object, you can access the context as well as the input stream.
     * @param offendingSymbol Offending token in the input token stream, unless recognizer is a lexer (then it's null).
     * @param line Line number in the input where the error occurred.
     * @param charPositionInLine Character position within the line where the error occurred.
     * @param msg Message to emit.
     * @param e Exception.
     */
    syntaxError(recognizer, offendingSymbol, line, charPositionInLine, 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    msg, 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    e) {
        const startPosition = new position_1.Position(this.lineOffset + line, charPositionInLine);
        const stopPosition = new position_1.Position(this.lineOffset + line, charPositionInLine + offendingSymbol.stopIndex - offendingSymbol.startIndex + 1);
        const range = new range_1.Range(startPosition, stopPosition);
        const diagnostic = new diagnostic_1.Diagnostic(range, templateErrors_1.TemplateErrors.syntaxError(msg), diagnostic_1.DiagnosticSeverity.Error, this.source);
        throw new templateException_1.TemplateException(diagnostic.toString(), [diagnostic]);
    }
}
exports.ErrorListener = ErrorListener;
//# sourceMappingURL=errorListener.js.map