/** @jsx React.DOM */

var React = require('react'),
    cx = require('classnames'),
    _ = require('underscore');
    ContentMixin = require('../mixins/content');

var ToolsDashboard = React.createClass({

  mixins: [ContentMixin],

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

        //Temporary fix until service removees order as part of tools patch api
        var maxOrderTool = _.max(this.state.data.tools, function(tool) {
            return tool.order;
        });

        var _csrf = $("[name='_csrf']").val(),
            toolData = [{
            "id": tool.id,
            "key": tool.key,
            "favorite": !($(event.target).hasClass('faved')),
            "order": maxOrderTool.order + 1
        }];

        //Change the state for the user and update the favorites in background
        $(event.target).toggleClass('faved');

        $.ajax({
            url: this.props.url,
            type: "post",
            headers: {
                "x-csrf-token": _csrf
            },
            contentType: "application/json",
            dataType: "json",
            processData: false,
            data: JSON.stringify(toolData)
        }).done(function (data) {
            if (data.success) {
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
                                    <a name={toolStatusLabel} href={tool.link} >{toolStatusLabel}</a>
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

module.exports = function (elementId, options) {

  var serviceUrl = "/api/v1/tools";

  if (options.basePath) {
      serviceUrl = "/" + options.basePath + serviceUrl;
  }

  $.ajax({
      url: serviceUrl + "/content?bundle=tools",
      dataType: 'json',
      success: function(data) {
          $(document).ready(function() {
              React.render(
                  <ToolsDashboard url={serviceUrl ? serviceUrl : ""} dictionary={data ? data : {}}/>,
                  document.getElementById(elementId)
              );
          });
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(status, err.toString());
      }.bind(this)
    });
};
