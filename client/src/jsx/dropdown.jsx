/** @jsx React.DOM */

var React = require('react'),
    Content = require('./content.jsx').Content;


var ToolsDropdown = React.createClass({

  loadToolsInformation: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  getInitialState: function() {
    return {data: {tools : []}};
  },


	componentDidMount: function() {
    /* This will be an ajax call to our tools endpoint */
    this.loadToolsInformation();
	},

  i18n : function (key) {
      if(typeof key === "string") {
        key = this.props.dictionary[key];
      }
      return key.value;
  },

	render: function () {

    var toolNodes = this.state.data.tools.map(function(tool) {
      return (
        <li>
          <a name={tool.name} href={tool.url}>
            {this.i18n(tool.name)}
          </a>
        </li>
      );
    }.bind(this));

		return (
      <li className="mer-more-menu">
        <a name="label" href="#" className="moreLink">
          {this.i18n("label")}
        </a>
        <ul>
          {toolNodes}
        </ul>
      </li>
		);
	}

});

module.exports = function (elementId, options) {

  var serviceUrl = "/api/v1/tools";

  if (options.basePath) {
      serviceUrl = "/" + options.basePath + serviceUrl;
  }

  $.ajax({
      url: serviceUrl + "/content?bundle=dropdown",
      dataType: 'json',
      success: function(data) {
        React.render(
          <ToolsDropdown url= {options.basePath? serviceUrl : ""} dictionary={data?data:{}}/>,
          document.getElementById(elementId)
        )
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(status, err.toString());
      }.bind(this)
    });
};
