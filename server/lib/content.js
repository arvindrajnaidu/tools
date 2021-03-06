"use strict";

var bundalo = require('bundalo'),
    log = require('./logger').logger;

var config = {
    "contentPath": __dirname + "/../../locales/",
    "fallback": "en-US",
    "engine": "none"
};

var bundle = bundalo(config);

function getDictionaryForLocality (locality, callback) {
    bundle.get({
        "bundle": ["tools"],
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