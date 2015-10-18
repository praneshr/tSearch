/**
 * @jsx React.DOM
 */

'use strict';

var $ = require('jquery');
var getResults = require('../actions/get-result-action');
var ajax;
module.exports = {
  getResults: function(query){
    ajax && ajax.abort();
    ajax = $.get('/query', {q:query})
                .done(function(data){
                  getResults.getResults(data);
                });
  }
};
