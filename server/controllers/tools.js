"use strict";

var async = require('async'),
    util = require('util'),
    _ = require('underscore'),
    log = require('../lib/logger').logger,
    ServiceCore = require('servicecore');    

/*
    Respond 
*/
function _allToolsRequestHandler (callback) {

    return function (err, result) {

        if (err) {
            log.error("An error occured while getting tools from backend service", {err: err, result: result});
            return callback(err);
        }
        var tools = _.map(result.body.tools, function (tool) {
            var active = true;
            if(tool.status === "notSignedUp" || tool.status === "pending") {
                active = false;
            }

            return _.extend({}, tool, {
                id: tool.id,
                key: tool.name,
                name: util.format("content:%s.name", tool.name),
                description: util.format("content:%s.description", tool.name),
                active: active
            });
        });

        callback(null, tools);
    };

}

function _getAllTools (accountNumber, countryCode) {

    var services  = require('../lib/services');
    var client = ServiceCore.create('merchanttoolserv');

    return function (callback) {

        var getToolsUrl = util.format('v1/customer/merchants/%s/tools', accountNumber),
            params = {
                method: 'GET',
                path: getToolsUrl,
                qs: {
                    countryCode: countryCode
                }
            };
        log.debug("Calling Merchant Tools service with params", params);
        
        client.request(params, _allToolsRequestHandler(callback));
    }
}

function _getFavTools (accountNumber, countryCode) {

    var services  = require('../lib/services');
    var client = ServiceCore.create('merchanttoolserv');

    return function (callback) {

        var getFavToolsUrl = util.format('v1/customer/merchants/%s/favoritetools', accountNumber),
            params = {
                method: 'GET',
                path: getFavToolsUrl,
                qs: {
                    countryCode: countryCode
                },
            };

        log.debug("Calling Favourite Merchant Tools service with params", params);
        client.request(params, function (err, result) {
            if (err) {
                log.error("An error calling Favourite Merchant Tools service", {err: err, result: result});
                return callback(err);
            }
            callback(null, result.body.tools);
        });            
    }
}

function _consolidateTheTools (req, res, next) {
    
    return function (err, result) {

        if (err) {
            return res.status(500).json();
        }

        req.model.data.bundle = "tools";

        var toolsByKey = _.indexBy(result.allTools, 'key');

        //Set favorite tools
        _.each(result.favoriteTools, function eachFavTool(tool) {

            if (toolsByKey[tool.name]) {
                toolsByKey[tool.name].favorite = true;
            }

        });

        result.allTools = _.map(toolsByKey, function (tool) {

            if (tool.favorite) {
                tool.category = 1; // Favorite
            } else if (tool.active) {
                tool.category = 2; // Active
            } else {
                tool.category = 3; // Inactive
            }
            return tool;

        });

        req.model.data.tools = _.sortBy(result.allTools, "category");

        next();
    };
}

function getTools (req, res, next) {

    log.info("getTools", req.params);

    async.parallel({

        allTools: _getAllTools(req.securityContext.actor.account_number, req.locality.country),
        favoriteTools: _getFavTools(req.securityContext.actor.account_number, req.locality.country)

    }, _consolidateTheTools(req, res, next));
};

function updateTools (req, res, next) {

    log.info("updateTools", req.params);
    var services  = require('../lib/services');
    var client = ServiceCore.create('merchanttoolserv');

    var urlStr = util.format('v1/customer/merchants/%s/favoritetools', req.securityContext.actor.account_number),
        payload = [];

    _.map(req.body.tools, function each(tool) {
        var eachTool = _.clone(tool);
        if(tool.favorite) {
            eachTool.favorite = 'A';
        } else {
            eachTool.favorite = 'I';
        }
        payload.push(eachTool);
    });

    var params = {
        method: 'PATCH',
        path: urlStr,
        qs: {
            countryCode: req.locality.country
        },
        body: payload
    };

    log.debug("Calling Merchant Tools service with params", params);
    client.request(params, function (err, result) {

        if (err) {
            log.error("An error occured while updating tools from backend service", {
                err: err,
                result: result
            });
            return res.status(500).json();
        }

        req.model.data.success = true;
        next();
    });
};

// Export

module.exports = {
    updateTools : updateTools,
    getTools : getTools,
    _consolidateTheTools : _consolidateTheTools,
    _getFavTools : _getFavTools,
    _getAllTools : _getAllTools,
    _allToolsRequestHandler : _allToolsRequestHandler
}