"use strict";

var contentLookup = require('../lib/content'),
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

    contentLookup.getDictionaryForLocality(req.languageCode, function (err, dictionary) {
        if (err) {
            return res.status(500).send(err);
        }
        var bundle = req.query.bundle || 'tools';
        var outJSON = getValue(dictionary[bundle], bundle);
        res.status(200).send(outJSON || {});
    });
};