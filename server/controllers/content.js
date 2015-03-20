"use strict";

var contentLookup = require('../lib/content'),
    log = require('../lib/logger').logger,
    traverse = require('traverse'),
    nconf = require('nconf');

nconf.argv().env();
var isPisces = (nconf.get('PISCES') === "true");

function getValue (obj, bundle, delimiter) {

    delimiter = delimiter || ".";
    
    return traverse(obj).map(function (x) {
        if (isPisces && this.isLeaf) {
            this.update({
                contentKey : this.path.toString().replace(/,/g, delimiter),
                contentBundle : bundle,
                value : x
            }, true);
        }
    });    
}    

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
        // log.debug("getContentForTools for %s", locale, dictionary);

        var bundle = req.query.bundle || 'tools';

        var outJSON = getValue(dictionary[bundle], bundle);
        
        res.status(200).send(outJSON || {});
    });
};