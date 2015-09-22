/*
 * A singleton that operates as the central hub for application updates.
 * For more information visit https://facebook.github.io/flux/
 */

'use strict';

var Flux = require('flux');
var assign = require('object-assign');

var AppDispatcher = assign(new Flux.Dispatcher(), {
 //Dispatcher code goes here
});

module.exports = AppDispatcher;
