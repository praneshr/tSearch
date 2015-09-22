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

  //Routing code goes here


  Page();
