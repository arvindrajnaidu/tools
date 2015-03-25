 /**
 * @name: Tools Metadata Middleware
 * @author: Amal John <apaulraj@paypal.com>
 * @brief: Middleware to fetch the metadata and other pre-requisites for tools
 **/

var CountrySpecialization = require('country-specialization'),
    _ = require('underscore'),
    log = require('../lib/logger').logger,
    shortstop = require('shortstop'),
    traverse = require('traverse');

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

 function metadataHandler(bundle, dictionary) {

     return function (key) {
         var retVal = findInObject(dictionary[bundle], key);

         return retVal;
     };
 }

 var metadata = function (req, res, next) {

     var configPath = __dirname + "/../../config",
         bundle = req.model.data.bundle;
     CountrySpecialization.loadCountryConfig(configPath, req.locality.country, function (err, dictionary) {

         if (err) {
             return res.status(200).send(req.model.data);
         }

         var resolver = shortstop.create();
         resolver.use('metadata', metadataHandler(bundle, dictionary));

         resolver.resolve(req.model.data, function (err, data) {
             if (err) {
                 log.error('Error occured in resolver.resolve in the metadata middleware', err);
                 return res.status(200).json(req.model.data);
             }

             res.status(200).json(data);
         });
     });
 };

 module.exports = metadata;
