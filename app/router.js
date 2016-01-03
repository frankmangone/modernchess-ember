import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  // Users
  this.route('users', function(){
    this.route('sign_up');
    this.route('log_in');
    this.route('user', { path: ':user_id' });
  });
  
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
