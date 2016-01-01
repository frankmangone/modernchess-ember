import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  // Modern Chess
  this.route('modernchess', function(){
  	this.route('rooms');
    this.route('room', { path: 'room/:room_id' });
  });

  // Classic Chess
  this.route('chess', function(){
  	this.route('rooms');
    this.route('room', { path: 'room/:room_id' });
  });
});

export default Router;
