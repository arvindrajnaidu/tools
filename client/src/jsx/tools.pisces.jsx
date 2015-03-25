var React = require('react'),
    ContentMixin = require('../mixins/content');

ContentMixin.i18n = function (key) {
    if(typeof key === "string") {
        key = this.props.dictionary[key];
    }
    return (<edit data-key={key.contentKey} data-bundle={key.contentBundle} data-original={key.value}>{key.value}</edit>)

};

module.exports = {
  ToolsDashboard : require ('./dashboard'),
  ToolsDropdown : require ('./dropdown')
}
