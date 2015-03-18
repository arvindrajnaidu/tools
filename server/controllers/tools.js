"use strict";

var async = require('async'),
    util = require('util'),
    _ = require('underscore'),
    log = require('../lib/logger').logger,
    ServiceCore = require('servicecore');

module.exports.getTools = function (req, res, next) {

    log.info("getTools", req.params);

    var client = ServiceCore.create('merchanttoolserv');
    async.parallel({
        allTools: function (callback) {
            var getToolsUrl = util.format('v1/customer/merchants/%s/tools', req.securityContext.actor.account_number),
                params = {
                    method: 'GET',
                    path: getToolsUrl,
                    qs: {
                        countryCode: req.locality.country
                    }
                };

            log.debug("Calling Merchant Tools service with params", params);
            client.request(params, function (err, result) {
                if (err) {
                    log.error("An error occured while getting tools from backend service", {
                        err: err,
                        result: result
                    });
                    return res.status(500).json();
                }
                var tools = result.body.tools.map(function (tool) {
                    var active = true;
                    if(tool.status === "notSignedUp" || tool.status === "pending") {
                        active = false;
                    }

                    return _.extend({}, tool, {
                        id: tool.id,
                        key: tool.name,
                        details: util.format("content:%s", tool.name),
                        active: active
                    });
                });

                callback(null, tools);
            });
        },
        favoriteTools: function (callback) {
            var getFavToolsUrl = util.format('v1/customer/merchants/%s/favoritetools', req.securityContext.actor.account_number),
                params = {
                    method: 'GET',
                    path: getFavToolsUrl,
                    qs: {
                        countryCode: req.locality.country
                    },
                };

            log.debug("Calling Merchant Tools service with params", params);
            client.request(params, function (err, result) {
                if (err) {
                    log.error("An error occured while getting tools from backend service", {
                        err: err,
                        result: result
                    });
                    return res.status(500).json();
                }

                callback(null, result.body.tools);
            });
        }
    }, function (err, result) {
        req.model.data.tools = [];
        req.model.data.bundle = "tools";

        var toolsByKey = _.indexBy(result.allTools, 'key'),
            favoriteTools = [],
            activeTools = [],
            inactiveTools = [];

        //Set favorite tools
        _.map(result.favoriteTools, function each(tool) {
            if (toolsByKey[tool.name]) {
                toolsByKey[tool.name].favorite = true;
                favoriteTools.push(toolsByKey[tool.name]);
                toolsByKey = _.omit(toolsByKey, tool.name);
            }
        });

        //set active and inactive tools
        _.map(toolsByKey, function each(tool, key) {
            if (tool.active === true) {
                activeTools.push(tool);
            } else {
                inactiveTools.push(tool);
            }
        });

        if (req.query.favorites === "true") {
            req.model.data.tools = favoriteTools;
        } else {
            req.model.data.tools = favoriteTools;
            req.model.data.tools = req.model.data.tools.concat(activeTools);
            req.model.data.tools = req.model.data.tools.concat(inactiveTools);
        }

        next();
    });
};

module.exports.updateTools = function (req, res, next) {

    log.info("updateTools", req.params);

    var client = ServiceCore.create('merchanttoolserv'),
        urlStr = util.format('v1/customer/merchants/%s/favoritetools', req.securityContext.actor.account_number),
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