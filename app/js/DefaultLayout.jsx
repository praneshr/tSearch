/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react');
var Toast = require('the-vision').components.Toast;

var DefaultLayout = React.createClass({
  componentDidMount: function() {

  },

  render: function() {
    var pageName = this.props.info.pageName;
    var RenderPage = require('./pages/' + pageName + ".jsx");
    var selectedPage = this.props.info.pageName.toLowerCase();
    return (
      <div className="layout">
      <div className="content-body">
          <RenderPage details={this.props.info}/>
        </div>
        <Toast/>
      </div>
    );
  }

});

module.exports = DefaultLayout;
