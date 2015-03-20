/** @jsx React.DOM */

var React = require('react');

var Localize = React.createClass({

	componentDidMount: function() {
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

	render: function () {
		return (
			<span>Helloo</span>
		);
	}

});

module.exports.Localize = Localize;
