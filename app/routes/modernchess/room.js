import Ember from 'ember';

export default Ember.Route.extend({
	model(params){

	},

	setupController(model, controller, params) {
		// Nevertheless, the controller just gets called when once
		this._super(model, controller);

		var room_id = params.state.params["modernchess.room"].room_id;
		this.controller.onRouteLoad(room_id);
	}
});

