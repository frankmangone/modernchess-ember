import Ember from 'ember';

export default Ember.Route.extend({
	model(params) {
		return this.store.find('user', params.user_id).then(
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
