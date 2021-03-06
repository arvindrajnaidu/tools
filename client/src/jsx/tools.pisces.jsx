var React = require('react'),
    ContentMixin = require('../mixins/content'),
    $ = require('jquery'),
    sinon = require('sinon'),
    dropdownMock = require('../../test/fixtures/dropdown'),
    dashboardMock = require('../../test/fixtures/dashboard'),
    toolsDataMock = require('../../test/fixtures/tools');

ContentMixin.i18n = function (key, noop) {

    if(noop) {
        return (<edit data-key={key.contentKey} data-bundle={key.contentBundle} data-original={key.value}>{key.value}</edit>);
    }

    if(typeof key === "string") {
        if (this.props.dictionary[key]) {
            key = this.props.dictionary[key];
        }
    }

    return (<edit data-key={key.contentKey} data-bundle={key.contentBundle} data-original={key.value}>{key.value}</edit>);
};

sinon.stub($, "ajax", function(options) {
    if (options.url.indexOf("/content?bundle=dropdown") > -1) {
        options.success(dropdownMock);
    } else if (options.url.indexOf("/content?bundle=dashboard") > -1) {
        options.success(dashboardMock);
    } else if (options.url.indexOf("/tools") > -1) {
        options.success(toolsDataMock);
    } else {
        console.log("--- Why are we here? ---", options.url);
        options.error('Unmocked resource requested');
    }
});

function wrappedDropdown (elementId, options) {
    var Dropdown = require ('./dropdown');
    options = options || {};
    options.jQuery = $;
    return Dropdown(elementId, options);
}

function wrappedDashboard (elementId, options) {
    var Dashboard = require ('./dashboard');
    options = options || {};
    options.jQuery = $;
    return Dashboard(elementId, options);
}

module.exports = {
  ToolsDashboard : wrappedDashboard,
  ToolsDropdown : wrappedDropdown
}
