'use strict';
/* jshint -W040 */

var contentLookup = require('../lib/content'),
    log = require('../lib/logger').logger,
    shortstop = require('shortstop');
    

function content(req, res, next) {

    if (req.model && req.model.data) {

        var bundle = req.model.data.bundle,
            locale = req.locality.language + '_' + req.locality.country;

        log.debug("Model Data in content middleware", req.model.data);
        contentLookup.getDictionaryForLocality(locale, function (err, dictionary) {            
            
            var resolver = shortstop.create();
            resolver.use('content', function (key) { 
                return dictionary[bundle][key];
            });
            
            resolver.resolve(req.model.data, function (err, data) {
                res.status(200).send(data);
            });
        });
        
    } else {
        next();
    }
};

// ------------------------------------------------------------------------
// Exports
// ------------------------------------------------------------------------
module.exports = content;
