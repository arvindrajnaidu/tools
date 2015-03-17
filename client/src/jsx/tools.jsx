/** @jsx React.DOM */

var React = require('react'),
    Localize = require('./localize.jsx').Localize;

var Tools = React.createClass({

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

	render: function () {

    var toolNodes = this.state.data.tools.map(function(tool) {
      return (
        <li><a href={tool.url}>{tool.details.name}</a></li>
      );
    });

		return (
      <li className="mer-more-menu">
        <a href="#" className="moreLink">{this.props.dictionary.label}</a>
        <ul>
          {toolNodes}
        </ul>
      </li>    
		);
	}

});

module.exports = function (elementId, options) {
  
  var serviceUrl = "/" + options.basePath + "/api/tools";

  $.ajax({
      url: serviceUrl + "/content?bundle=dropdown",
      dataType: 'json',
      success: function(data) {
        React.render(
          <Tools url= {options.basePath? serviceUrl : ""} dictionary={data?data:{}}/>,
          document.getElementById(elementId)
        )
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(status, err.toString());
      }.bind(this)
    });    
};
