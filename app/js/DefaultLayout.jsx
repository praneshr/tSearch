/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react');
var Toast = require('the-vision').components.Toast;

var DefaultLayout = React.createClass({
  render: function() {
    var pageName = this.props.info.pageName;
    var RenderPage = require('./pages/' + pageName + ".jsx");
    var selectedPage = this.props.info.pageName.toLowerCase();
    return (
      <div className="layout">
        <RenderPage details={this.props.info}/>
      </div>
    );
  }

});

module.exports = DefaultLayout;
