/** @jsx React.DOM */

var React = require('react'),
    cx = require('classnames');

var ToolsDashboard = React.createClass({

    fetchTools: function() {
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
        this.fetchTools();
	},

    updateFavorites: function(tool, event) {
        event && event.preventDefault();

        var _csrf = $("[name='_csrf']").val();
            toolData = {
            "id": tool.id,
            "key": tool.key,
            "favorite": !($(event.target).hasClass('faved')),
            "order": 6,
            "_csrf": _csrf
        };

        //Change the state for the user and update the favorites in background
        $(event.target).toggleClass('faved');

        $.ajax({
            url: this.props.url,
            type: "POST",
            data: toolData
        }).done(function (data) {
            if (data.data.success) {
            }
        }).fail(function () {
            //$(e.target).toggleClass('faved');
        });
    },

	render: function () {
        var props = this.props;
        var state = this.state;

        var toolNode = function (tool) {
            var inactiveClass = tool.active ? '' : 'inactive',
                favoriteClass = tool.favorite ? 'faved' : '',
                toolStatusLabel = (tool.active ? props.dictionary.tool.activeLabel :
                    props.dictionary.tool.inactiveLabel);

            return (
                <div className="row-fluid tools-set">
                    <div id={tool.key} className={cx("col-sm-3", "tool", inactiveClass)}>
                        <div className="toolStatus"></div>
                        <div className="toolImage"></div>
                        <ul>
                            <li>
                                <h4>{tool.name}</h4>
                            </li>
                            <li>
                                <p>{tool.description}</p>
                            </li>
                        </ul>
                        <div className="toolAction">
                            <div className="toolOptions">
                                <span className="flow">
                                    <a href={tool.link} >{toolStatusLabel}</a>
                                </span>
                                <span className={cx("fav", favoriteClass)} onClick={this.updateFavorites.bind(this, tool)}/>
                            </div>
                        </div>
                    </div>
                </div>
                );
        }.bind(this);

        return (
            <div id="tools" className="container-fluid">
                {state.data.tools ? state.data.tools.map(toolNode) : ''}
            </div>
        );
	}
});

module.exports.ToolsDashboard = function (elementId, options) {
  
  var serviceUrl = "/" + options.basePath + "/api/v1/tools";

  $.ajax({
      url: serviceUrl + "/content?bundle=tools",
      dataType: 'json',
      success: function(data) {
          $(document).ready(function() {
              React.render(
                  <ToolsDashboard url={options.basePath ? serviceUrl : ""} dictionary={data ? data : {}}/>,
                  document.getElementById(elementId)
              );
          });
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(status, err.toString());
      }.bind(this)
    });
};
