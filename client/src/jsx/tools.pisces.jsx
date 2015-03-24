var ContentMixin = require('../mixins/content');

ContentMixin.i18n = function (key) {
    if(typeof key === "string") {
      // key = this.props.dictionary[key];  
      return "REDACTED";  
    }
    return "REDACTED";
};

module.exports = {
  ToolsDashboard : require ('./dashboard'),
  ToolsDropdown : require ('./dropdown')
}
