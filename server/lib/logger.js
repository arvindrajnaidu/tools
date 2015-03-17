var winston = require('winston'),
    util = require('util'),
    moment = require('moment'),
    cal = require('cal'),
    nconf = require('nconf'),
    logLevels = {
        levels: {
            debug: 0,
            info: 1,
            warn: 2,
            error: 3,
            fatal: 4,
        },
        colors: {
            foo: 'blue',
            bar: 'green',
            baz: 'yellow',
            foobar: 'red',
            foobar: 'magenta'
        }
    };

/*
  Formatter
*/
var Timestamp = function () {
    return moment().format();
}

var Formatter = function (options) {

    var logStr = util.format(
        "%s:%s - %s \n\t %s",
        options.timestamp(),
        options.level.toUpperCase(), (undefined !== options.message ? options.message : ''), (options.meta && Object.keys(options.meta).length ? JSON.stringify(options.meta) : '')
    );

    return logStr;
};

/*
  Cal Logger
*/
var CalLogger = winston.transports.CalLogger = function (options) {
    this.name = 'calLogger';
    this.level = options.level || 'info';
};

util.inherits(CalLogger, winston.Transport);

CalLogger.prototype.log = function (level, msg, meta, callback) {

    var evt = cal.createEvent(level, msg);
    evt.addData(meta);
    evt.complete();
    callback(null, true);

};


/*
  Logger that will be exported
*/
function Logger(level) {

    var logger = new(winston.Logger)({
        transports: [
            new(winston.transports.Console)({
                timestamp: Timestamp,
                level: level || (nconf.get('NODE_ENV') === 'production') ? 'info' : 'debug',
                colorize: true,
                prettyPrint: true,
                depth: 2,
                prettyPrint: true,
                showLevel: true,
                formatter: Formatter
            }),
            new(CalLogger)({
                timestamp: Timestamp,
                level: level || (nconf.get('NODE_ENV') === 'production') ? 'info' : 'debug',
                prettyPrint: true,
                depth: 2,
                showLevel: true,
                formatter: Formatter
            })
        ],
        levels: logLevels.levels
    });
    winston.addColors(logLevels.colors);
    return logger;

}

/*
  Create a new instance of logger
*/
module.exports.createLogger = function (level) {
    return Logger(level);
};

/*
  Export a default logger
*/
module.exports.logger = Logger();