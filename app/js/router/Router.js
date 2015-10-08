/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react');
var Page = require('page');
var DefaultLayout = require('../DefaultLayout.jsx');

  function render(details){
    React.render(
      <DefaultLayout info={details}/>,
      document.getElementById('app')
    );
  };

Page('/',function(context) {
  render({pageName:'Index'});
});
Page('/search/:query',function(context) {
  render({pageName:'Index',query: context.params.query});
})


  Page();
