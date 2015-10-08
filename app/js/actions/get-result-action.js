'use strict';

var AppDispatcher = require('../dispatcher/dispatcher');
var ActionsList = require('./action-list');

module.exports = {
  getResults: function(data){
    AppDispatcher.getResults({
      actionType: ActionsList.GET_RESULTS,
      data: data
    });
  }
};
