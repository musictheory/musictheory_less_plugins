"use strict";

const less = require("less");
const _    = require("lodash");


class RenamerPlugin {

    get isPreEvalVisitor() { return true; }

    constructor(less, inMap)
    {
        let rename = { };

        _.each(inMap, (value, key) => {
            rename["." + key] = "." + value;
        });

        this._less    = less;
        this._visitor = new less.visitors.Visitor(this);
        this._rename  = rename;
    }

    run(root)
    {
        return this._visitor.visit(root);
    }

    visitRuleset(ruleset, options) {
        _.each(ruleset.selectors, selector => {
            _.each(selector.elements, element => {
                let replacement = this._rename[element.value];

                if (replacement) {
                    element.value = replacement;
                }
            });
        });

        return ruleset;
    }

}


module.exports = RenamerPlugin;
