/**
 * @jsx React.DOM
 */

'use strict';

var AppDispatcher = require('../dispatcher/dispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var _ = require('underscore');
var ActionsList = require('../actions/action-list');

var Results = {};

var getResults = assign({}, EventEmitter.prototype, {
  emitChange: function(){
    this.emit('change');
  },

  addChangeListener: function(callback) {
    this.on('change', callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener('change', callback);
  },

  clear: function(){
    Results = {};
  },

  setResults: function(data){
    Results = data || {}
  },

  getResults: function(){
    return Results;
  },
});

AppDispatcher.register(function(payload) {
  var action = payload.actionType;

  switch(action){
    case ActionsList.GET_RESULTS:
      getResults.setResults(payload.data);
      break;

    default:
      return true;
  }
  getResults.emitChange();
  return true;
});

module.exports = getResults;
