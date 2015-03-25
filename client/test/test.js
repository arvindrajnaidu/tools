'use strict';

require.config( {
    paths: {
        'jquery' : '//code.jquery.com/jquery-2.1.3.min',
        'tools': '../dist/js/tools.pisces',
        'text': 'text',
        'pisces': 'http://pisces-168854.slc01.dev.ebayc3.com/js/pisces',
    }
});

require(['jquery', 'tools', 'text!fixtures/dropdown.json', 'text!fixtures/tools.json', 'pisces'], function (jQuery, Tools, dropdownMock, toolsDataMock) {

    sinon.stub(jQuery, "ajax", function(options) {
        if (options.url.indexOf("/content?bundle=dropdown") > -1) {
            options.success(JSON.parse(dropdownMock));
        } else {
            options.success(JSON.parse(toolsDataMock));
        }
    });

    Tools.ToolsDropdown("toolsDashboard", {});
});