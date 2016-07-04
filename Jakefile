"use strict";

const less       = require("less");
const fs         = require("fs");
const lessTest   = require("less/test/less-test");
const lessTester = lessTest();

const index = require(".");
const PrefixerPlugin = index.PrefixerPlugin;
const RemoverPlugin  = index.RemoverPlugin;
const RenamerPlugin  = index.RenamerPlugin;


task("default", [ ], function() {
    let plugins = [{
        install: function(less, pluginManager) {
            pluginManager.addVisitor(new RemoverPlugin(less, "ToRemove"));
            pluginManager.addVisitor(new PrefixerPlugin(less));

            pluginManager.addVisitor(new RenamerPlugin(less, {
                "Alpha": "_a",
                "Beta":  "_b",
                "Gamma": "_g",
                "Delta": "_d"
            }));
        }
    }];

    lessTester.runTestSet({ silent: true, plugins: plugins }, "plugin/");
})