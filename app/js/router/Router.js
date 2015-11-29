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
Page('/search/:query/:page',function(context) {
  render({pageName:'Index',query: context.params.query,page:context.params.page});
})


  Page();
