"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Runtime template state.
 */
class EvaluationTarget {
    /**
     * Creates a new instance of the [EvaluationTarget](xref:botbuilder-lg.EvaluationTarget) class.
     * @param templateName Template name.
     * @param scope Template scope.
     */
    constructor(templateName, scope) {
        this.templateName = templateName;
        this.scope = scope;
        this.cachedEvaluatedChildren = new Map();
    }
    /**
     * Get current instance id. If two target has the same Id,
     * we can say they have the same template evaluation result.
     * @returns Id.
     */
    getId() {
        const scopeVersion = this.scope ? this.scope.version() : '';
        return this.templateName + scopeVersion;
    }
}
exports.EvaluationTarget = EvaluationTarget;
//# sourceMappingURL=evaluationTarget.js.map