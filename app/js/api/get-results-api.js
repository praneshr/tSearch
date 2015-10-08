/**
 * @jsx React.DOM
 */

'use strict';

var $ = require('jquery');
var createTeatcaseActions = require('../actions/get-result-action');

module.exports = {
  getResults: function(query){
    $.get('/query', {q:query})
    .done(function(data){
      // console.log(data)
    });
  }
};
