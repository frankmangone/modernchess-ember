import Ember from 'ember';

export default Ember.Route.extend({
	model(params){
		return this.store.find('chess/room', params.room_id).then(
			// success
			function(data){
				return data;
			},
			// reject
			function(error){
				return error;
			}
		);
	},

	afterModel() {
		Ember.run.later( () => {
			this.refresh();
		}, 5000);
	},

});

