/*jshint node:true*/
/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    // Add options here
  });

  app.import('vendor/websockets/websocket_rails.js');
  app.import('vendor/websockets/event.js');
  app.import('vendor/websockets/abstract_connection.js');
  app.import('vendor/websockets/http_connection.js');
  app.import('vendor/websockets/websocket_connection.js');
  app.import('vendor/websockets/channel.js');

  return app.toTree();
};
