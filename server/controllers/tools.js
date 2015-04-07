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
            var active = true,
                toolStatus = (tool.status) ? tool.status : "signedUp";

            if(toolStatus === "notSignedUp" || tool.status === "pending") {
                active = false;
            }

            return _.extend({}, {
                id: tool.id,
                key: tool.name,
                name: util.format("content:%s.name", tool.name),
                description: util.format("content:%s.description", tool.name),
                link: util.format("metadata:%s.%s", tool.name, toolStatus),
                active: active,
                popularity: tool.popularity,
                favorite: tool.favorite
            });
        });

        callback(null, tools);
    };

}

function _getAllTools (req) {

    var client = ServiceCore.create('merchanttoolserv');

    return function (callback) {

        var getToolsUrl = 'v1/customer/merchants/tools',
            params = {
                method: 'GET',
                path: getToolsUrl,
                qs: {
                    countryCode: req.locality.country
                }
            };

        if (req.query.favorite === "true") {
            params.qs.favorite = true;
        };

        log.debug("Calling Merchant Tools service with params", params);
        client.request(params, _allToolsRequestHandler(callback));
    }
}

function _consolidateTheTools (req, res, next) {
    
    return function (err, result) {

        if (err) {
            return res.status(500).json();
        }

        req.model.data.bundle = "tools";

        result.allTools = _.map(result.allTools, function (tool) {

            if (tool.favorite) {
                tool.category = 1; // Favorite
            } else if (tool.active) {
                tool.category = 2; // Active
            } else {
                tool.category = 3; // Inactive
            }
            return tool;

        });

        //Sort by popularity
        result.allTools = _.sortBy(result.allTools, "popularity");

        //Sort by category
        req.model.data.tools = _.sortBy(result.allTools, "category");

        next();
    };
}

function getTools (req, res, next) {

    log.info("getTools", req.params);

    async.parallel({
        allTools: _getAllTools(req)
    }, _consolidateTheTools(req, res, next));
};

function updateTools (req, res, next) {

    log.info("updateTools", req.params);
    var services  = require('../lib/services');
    var client = ServiceCore.create('merchanttoolserv');

    var urlStr = 'v1/customer/merchants/tools',
        tools = [];

    _.map(req.body, function each(tool) {
        //Map to an object that the service understands
        var eachTool = {
            "id": tool.id,
            "name": tool.key,
            "popularity": tool.popularity,
            "favorite": tool.favorite
        };

        tools.push(eachTool);
    });

    var payload = {
            "tools": tools
        },
        params = {
            method: 'PATCH',
            path: urlStr,
            qs: {
                countryCode: req.locality.country
            },
            body: JSON.stringify(payload)
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
    _getAllTools : _getAllTools,
    _allToolsRequestHandler : _allToolsRequestHandler
}