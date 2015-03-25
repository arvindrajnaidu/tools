'use strict';

require.config( {
    paths: {
        'jquery' : 'https://code.jquery.com/jquery-2.1.3.min',
        'sinon': 'https://cdnjs.cloudflare.com/ajax/libs/sinon.js/1.7.3/sinon-min',
        'tools': '../dist/js/tools.pisces',
        'text': 'text',
        'pisces': 'http://pisces-168854.slc01.dev.ebayc3.com/js/pisces',
    }
});

require(['jquery', 'sinon', 'tools', 'text!fixtures/dropdown.json', 'text!fixtures/tools.json', 'pisces'], function (jQuery, sinon, Tools, dropdownMock, toolsDataMock) {

    sinon.stub(jQuery, "ajax", function(options) {
        if (options.url.indexOf("/content?bundle=dropdown") > -1) {
            options.success(JSON.parse(dropdownMock));
        } else {
            options.success(JSON.parse(toolsDataMock));
        }
    });

    Tools.ToolsDropdown("toolsDashboard", {});
});
