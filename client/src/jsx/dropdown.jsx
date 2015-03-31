/** @jsx React.DOM */

var React = require('react'),
    ContentMixin = require('../mixins/content'),
    $;


var ToolsDropdown = React.createClass({

  mixins: [ContentMixin],
  loadToolsInformation: function() {
    $.ajax({
      url: this.props.url + "?favorite=true",
      dataType: 'json',
      success: function(data) {
        data.tools = data.tools.filter(function (tool) {
          return tool.favorite;
        });
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

	render: function () {

    var toolNodes = this.state.data.tools.map(function(tool) {
      return (
        <li>
          <a name={tool.name} href={tool.link}>
            {this.i18n(tool.name)}
          </a>
        </li>
      );
    }.bind(this));

		return (
      <li className="mer-more-menu">
        <a name="label" href="#" className="moreLink">
          {this.i18n(this.props.dictionary["label"])}
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

  if(options.jQuery) {
      $ = options.jQuery
  }

  $.ajax({
      url: serviceUrl + "/content?bundle=dropdown",
      dataType: 'json',
      success: function(data) {
        React.render(
          <ToolsDropdown url= {serviceUrl ? serviceUrl : ""} dictionary={data?data:{}}/>,
          document.getElementById(elementId)
        )
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(status, err.toString());
      }.bind(this)
    });
};
