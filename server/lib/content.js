"use strict";

var bundalo = require('bundalo'),
    log = require('../lib/logger').logger;

var config = {
    "contentPath": __dirname + "/../../locales/",
    "fallback": "en-US",
    "engine": "none"
};

var bundle = bundalo(config);

function getDictionaryForLocality (locality, callback) {
    bundle.get({
        "bundle": ["errors/404", "errors/500", "errors/503", "tools", "dropdown"],
        "locality": locality
    }, function bundaloReturn (err, data) {
        if (err || data.error) {
            return callback(err || data.error);
        }
        log.debug("getDictionaryForLocality", data);
        callback(null, data);
    });
}

module.exports.getDictionaryForLocality = getDictionaryForLocality;