'use strict';
/* jshint -W040 */

var contentLookup = require('../lib/content'),
    log = require('../lib/logger').logger,
    shortstop = require('shortstop'),
    traverse = require('traverse'),
    nconf = require('nconf');


nconf.argv().env();
var isPisces = (nconf.get('PISCES') === "true");

function findInObject (obj, pathAsString, delimiter) {

    delimiter = delimiter || ".";
    
    var foundValue;
    
    traverse(obj).forEach(function (x) {
        if (this.isLeaf & this.path.toString().replace(/,/g, delimiter) === pathAsString) {
          foundValue = x;
        }
    });    

    return foundValue;
}

function contentHandler(bundle, dictionary) {

    return function (key) {

        var retVal = findInObject(dictionary[bundle], key);
        if (isPisces) {
            // Now we have to append the bundle name and key to every response
            return {
                contentKey : key,
                contentBundle : bundle,
                value : retVal
            }                
        } 
        return retVal;
    };
}

function content(req, res, next) {

    if (req.model && req.model.data) {

        var bundle = req.model.data.bundle,
            locale = req.locality.language + '_' + req.locality.country;

        log.debug("Model Data in content middleware", req.model.data);

        contentLookup.getDictionaryForLocality(locale, function (err, dictionary) {            
            
            if (err) {
                log.error('Error occured in getDictionaryForLocality in the content middleware', err);

                // Send out the reponse without localization - Is this okay?
                return res.status(200).send(req.model.data);
            }

            var resolver = shortstop.create();

            resolver.use('content', contentHandler(bundle, dictionary));
            
            resolver.resolve(req.model.data, function (err, data) {
                if (err) {
                    log.error('Error occured in resolver.resolve in the content middleware', err);

                    // Send out the reponse without localization - Is this okay?
                    return res.status(200).send(req.model.data);
                }                
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
