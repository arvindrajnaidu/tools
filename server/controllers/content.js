"use strict";

var contentLookup = require('../lib/content'),
    log = require('../lib/logger').logger;

module.exports.getContentForTools = function (req, res, next) {

    log.info("getContentForTools", req.params);

    var locale = req.locality.language + '_' + req.locality.country;

    contentLookup.getDictionaryForLocality(locale, function (err, dictionary) {
        if (err) {
            log.error("Error occured while getting dictionary from props", {
                err: err,
                dictionary: dictionary
            });
            return res.status(500).send();
        }
        log.debug("Req Model", req.params);
        log.debug("getContentForTools for %s", locale, dictionary);

        var bundle = req.query.bundle || 'tools';
        
        res.status(200).send(dictionary[bundle] || {});
    });
};