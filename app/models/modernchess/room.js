import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
	type: DS.attr('string'),
  game_type: DS.attr('string'),
  turn: DS.attr('string'),
  board: DS.attr(),
});
