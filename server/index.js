"use strict";

var _ = require('underscore'),
    log = require('./lib/logger').logger,
    contentMiddleware = require('./middleware/content');

module.exports = function (app, options, callback) {

    var swaggerTools = require("swagger-tools"),
        client = require("./lib/services");

    // swaggerRouter configuration
    _.defaults(options, {
        controllers: __dirname + '/controllers',
        useStubs: process.env.NODE_ENV === 'development' ? true : false
    });

    // The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
    var swaggerDoc = require('./api/tools.json');

    client.merchantToolsClient = options.merchantToolsClient;

    // Initialize the Swagger middleware
    swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {

        // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
        app.use(middleware.swaggerMetadata());

        // Validate Swagger requests
        app.use(middleware.swaggerValidator());

        // Route validated requests to appropriate controller
        app.use(middleware.swaggerRouter(options));

        // Content middleware        
        app.use(swaggerDoc.basePath + "/*", contentMiddleware);

        // Serve the Swagger documents and Swagger UI
        app.use(middleware.swaggerUi());

        if (callback) {
            callback();
        }

    });
};