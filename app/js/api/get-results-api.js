/**
 * @jsx React.DOM
 */

'use strict';

var $ = require('jquery');
var getResults = require('../actions/get-result-action');
var ajax;
module.exports = {
  getResults: function(query,page){
    ajax && ajax.abort();
    ajax = $.get('/query', {q:query,page:page})
                .done(function(data){
                  getResults.getResults(data);
                });
  }
};
