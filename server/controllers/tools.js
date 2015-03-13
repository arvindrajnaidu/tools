"use strict";

var services = require('../lib/services'),
    util = require('util'),
    _ = require('underscore'),
    log = require('../lib/logger').logger;


module.exports.getTools = function (req, res, next) {

    log.info("getTools", req.params);

    var urlStr = util.format('v1/customer/merchants/%s/tools', req.securityContext.actor.account_number);

    var params = {
        method: 'GET',
        path: urlStr,
        qs: {
            countryCode: req.locality.country
        }
    };
    
    log.debug("Calling Merchant Tools service with params", params);

    services.merchantToolsClient.request(params, function (err, result) {

        if (err) {
            log.error("An error occured while getting tools from backend service", {
                err: err,
                result: result
            });
            return res.status(500).send();
        }
        
        req.model.data.tools = result.body.tools.map(function (tool) {
            return _.extend({}, tool, {
                id  : tool.id,
                key: tool.name,
                details : util.format("content:%s", tool.name)
            });
        });

        req.model.data.bundle = "tools";

        next();
    });
};