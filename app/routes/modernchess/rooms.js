import Ember from 'ember';

export default Ember.Route.extend({
	model() {
		return this.store.findAll('modernchess/room').then(
			// success
			function(data){
				return data;
			},
			// reject
			function(error){
				return error;
			}
		);
	}
});

