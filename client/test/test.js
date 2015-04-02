'use strict';

require.config( {
    paths: {
        'tools': '../dist/js/tools.pisces'
    }
});

require(['tools'], function (Tools) {
    
    Tools.ToolsDropdown("toolsDropdown", {});

    Tools.ToolsDashboard("toolsDashboard", {});

    require(['//code.jquery.com/jquery-1.8.0.min.js', 'http://pisces-168854.slc01.dev.ebayc3.com/js/pisces']);
});