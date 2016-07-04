"use strict";

const less = require("less");
const _    = require("lodash");


class RemoverPlugin {

    get isPreEvalVisitor() { return true; }
    get isReplacing()      { return true; }

    constructor(less, classNamesToRemove)
    {
        let remove = { };

        _.each(_.flattenDeep(_.toArray(arguments)), function(className) {
            remove["." + className] = true;
        });

        this._less    = less;
        this._visitor = new less.visitors.Visitor(this);
        this._remove  = remove;
    }

    run(root)
    {
        return this._visitor.visit(root);
    }

    visitRuleset(ruleset, options) {
        let matches = false;

        _.each(ruleset.selectors, selector => {
            _.each(selector.elements, element => {
                if (this._remove[element.value]) {
                    matches = true;
                }
            });
        });

        return matches ? undefined : ruleset;
    }

}


module.exports = RemoverPlugin;
