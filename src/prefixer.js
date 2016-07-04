"use strict";

const _    = require("lodash");


class PrefixerPlugin {

constructor(less)
{
    this._less    = less;
    this._visitor = new less.visitors.Visitor(this);


    this._ruleset = null;
    this._rules   = [ ];

    this._rulesetStack = [ ];
    this._rulesStack   = [ ];
}


cloneRule(rule, newName, newValue)
{
    let newRule = new this._less.tree.Rule(
        newName,
        newValue || rule.value,
        rule.important,
        rule.merge,
        rule.index,
        rule.currentFileInfo,
        rule.inline,
        rule.variable
    );

    if (!this._rules) this._rules = [ ];
    this._rules.push(newRule);
}


run(root)
{
    return this._visitor.visit(root);
}


visitRuleset(ruleset, visitArgs)
{
    this._rulesetStack.push(this._ruleset);
    this._rulesStack.push(this._rules);

    this._ruleset = ruleset;
    this._rules   = null;
}


visitRulesetOut(ruleset, visitArgs)
{
    if (this._rules) {
        this._rules.reverse();

        _.each(this._rules, rule => {
            this._ruleset.prependRule(rule);
        });
    }

    this._ruleset = this._rulesetStack.pop();
    this._rules   = this._rulesStack.pop();
}


visitRule(rule, visitArgs)
{
    let name  = rule.name;
    let value = rule.value && rule.value.value;

    if (name == "display") {
        if (rule.value.value == "flex") {
            let newValue = _.clone(rule.value);
            newValue.value = "-webkit-flex";

            this.cloneRule(rule, "display", newValue);
        }

    } else if (name == "transform" || name == "transform-origin") {
        this.cloneRule(rule, "-webkit-" + name);

    } else if (name == "user-select") {
        this.cloneRule(rule, "-ms-"     + name);
        this.cloneRule(rule, "-webkit-" + name);
        this.cloneRule(rule, "-moz-"    + name);

    } else if (name.indexOf("flex") === 0) {
        this.cloneRule(rule, "-webkit-" + name);
    }
}

}


module.exports = PrefixerPlugin;
