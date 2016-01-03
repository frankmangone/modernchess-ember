import Ember from 'ember';

export default Ember.Route.extend({
	model() {
		return this.store.findAll('user').then(
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
